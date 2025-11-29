/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing Notion ID" },
      { status: 400 }
    );
  }

  try {
    // Panggil internal API Notion
    const res = await fetch("https://www.notion.so/api/v3/getPublicPageData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ pageId: id }),
    });

    const data = await res.json();

    if (!data || data.error || !data.recordMap) {
      return NextResponse.json({
        success: false,
        error: "Database is private or invalid.",
      });
    }

    const recordMap: any = data.recordMap || {};

    // -----------------------------
    // 1. CARI ROOT PAGE / PAGE VIEW
    // -----------------------------
    const blockMap: any = recordMap.block || {};
    const allBlocks: any[] = Object.values(blockMap);

    // cari block yang type-nya "collection_view_page" dulu
    const pageBlockWrapper: any =
      allBlocks.find(
        (b: any) => b.value?.type === "collection_view_page"
      ) ||
      allBlocks.find((b: any) => b.value?.type === "page") ||
      allBlocks[0];

    const pageBlock = pageBlockWrapper?.value;

    // Title & icon
    const title =
      pageBlock?.properties?.title?.[0]?.[0] || "Untitled Database";

    const icon =
      pageBlock?.format?.page_icon ||
      pageBlock?.format?.block_icon ||
      null;

    // --------------------------------
    // 2. COLLECTION & SCHEMA (OPTIONAL)
    // --------------------------------
    const collectionMap: any = recordMap.collection || {};
    const collectionObj: any =
      Object.values(collectionMap)[0] || null;
    const collection = collectionObj?.value || null;
    const schema = collection?.schema || {};

    // --------------------------------
    // 3. VIEW ID (UNTUK ?v= DI URL)
    // --------------------------------
    const collectionViewMap: any = recordMap.collection_view || {};
    const viewIds = Object.keys(collectionViewMap);
    const firstViewId: string | null = viewIds[0] || null;

    // --------------------------------
    // 4. GENERATE PUBLIC URL YANG BENAR
    // --------------------------------
    const pageUuid: string | null = pageBlock?.id
      ? pageBlock.id.replace(/-/g, "")
      : null;

    let publicUrl: string | null = null;

    if (pageUuid && firstViewId) {
      // format: /pageUUID?v=viewUUID  → sama persis dengan Notion
      publicUrl = `https://www.notion.so/${pageUuid}?v=${firstViewId}`;
    } else if (pageUuid) {
      publicUrl = `https://www.notion.so/${pageUuid}`;
    }

    return NextResponse.json({
      success: true,
      title,
      icon,
      propertiesCount: Object.keys(schema).length,
      publicUrl,
    });
  } catch (error) {
    console.error("notion-detect error:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to fetch Notion data.",
    });
  }
}
