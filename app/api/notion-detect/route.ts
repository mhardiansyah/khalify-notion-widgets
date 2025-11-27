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

    const title = block?.properties?.title?.[0]?.[0] || "Untitled Database";

    const icon =
      block?.format?.page_icon ||
      block?.format?.block_icon ||
      null;

    // ---- COLLECTION ----
    const collectionObj: any = data?.recordMap?.collection
      ? (Object.values(data.recordMap.collection)[0] as any)
      : null;

    const collection = collectionObj?.value || null;

    // ---- VIEW ----
    const viewObj: any = data?.recordMap?.collection_view
      ? (Object.values(data.recordMap.collection_view)[0] as any)
      : null;

    const view = viewObj?.value || null;

    const schema = collection?.schema || {};

    // -------------------------------
    // GENERATE REAL DATABASE URL
    // -------------------------------
    // pageUUID → ID page root
    const pageUUID = block?.id?.replace(/-/g, "") || null;

    // viewId → ID dari collection view
    const viewId =
      Object.keys(data?.recordMap?.collection_view || {})[0] || null;

    // URL FINAL (100% sama Notion)
    const publicUrl =
      pageUUID && viewId
        ? `https://www.notion.so/${pageUUID}?v=${viewId}`
        : null;

    return NextResponse.json({
      success: true,
      title,
      icon,
      propertiesCount: Object.keys(schema).length,
      publicUrl, // ⬅ FIXED BRO!
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch Notion data.",
    });
  }
}
