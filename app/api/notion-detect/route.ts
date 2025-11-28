/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  try {
    const res = await fetch("https://www.notion.so/api/v3/getPublicPageData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ pageId: id }),
    });

    const data = await res.json();

    if (!data || data.error) {
      return NextResponse.json({
        success: false,
        error: "Database is private or invalid.",
      });
    }

    // ---- BLOCK ROOT ----
    const block = data?.recordMap?.block?.[id]?.value;
    const pageUUID = block?.id?.replace(/-/g, "") || id.replace(/-/g, "");

    const collectionViewKeys = Object.keys(data?.recordMap?.collection_view || {});
    const viewId = collectionViewKeys.length > 0 ? collectionViewKeys[0] : null;

    // ---- GENERATE SAFE URL ----
    // PRIORITY:
    // 1. pageUUID?v=viewId
    // 2. pageUUID only (fallback)
    let publicUrl = null;

    if (pageUUID && viewId) {
      publicUrl = `https://www.notion.so/${pageUUID}?v=${viewId}`;
    } else {
      // fallback ALWAYS WORKS
      publicUrl = `https://www.notion.so/${pageUUID}`;
    }

    return NextResponse.json({
      success: true,
      title: block?.properties?.title?.[0]?.[0] || "Untitled Database",
      icon: block?.format?.page_icon || block?.format?.block_icon || null,
      propertiesCount: 0,
      publicUrl,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch Notion data.",
    });
  }
}
