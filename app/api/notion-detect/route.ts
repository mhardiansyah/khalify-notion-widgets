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

    const block = data?.recordMap?.block?.[id]?.value;

    const title =
      block?.properties?.title?.[0]?.[0] || "Untitled Database";

    const icon =
      block?.format?.page_icon ||
      block?.format?.block_icon ||
      null;

    // ---- SAFE COLLECTION (NO TS ERROR) ----
    const collectionObj: any = data?.recordMap?.collection
      ? (Object.values(data.recordMap.collection)[0] as any)
      : null;

    const collection = collectionObj?.value || null;

    // ---- SAFE VIEW (NO TS ERROR) ----
    const viewObj: any = data?.recordMap?.collection_view
      ? (Object.values(data.recordMap.collection_view)[0] as any)
      : null;

    const view = viewObj?.value || null;

    // ---- SAFE SCHEMA ----
    const schema = collection?.schema || {};

    return NextResponse.json({
      success: true,
      title,
      icon,
      type: view?.type || "unknown",
      propertiesCount: Object.keys(schema).length,
      raw: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch Notion data.",
    });
  }
}
