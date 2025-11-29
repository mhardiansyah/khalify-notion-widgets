/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

const NOTION_TOKEN = process.env.NOTION_TOKEN_V2;
if (!NOTION_TOKEN) {
  console.error("❌ NOTION_TOKEN_V2 missing");
}

const headers = {
  "Content-Type": "application/json;charset=UTF-8",
  "Cookie": `token_v2=${NOTION_TOKEN}`,
};

function cleanId(id: string) {
  return id.replace(/-/g, "");
}

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({
      success: false,
      error: "Missing ID",
    });
  }

  try {
    let pageId = id;

    // ============================
    // 1. If input starts with ntn_
    // ============================
    if (id.startsWith("ntn_")) {
      const res = await fetch("https://www.notion.so/api/v3/getRecordValues", {
        method: "POST",
        headers,
        body: JSON.stringify({
          requests: [{ id, table: "collection" }],
        }),
      });

      const data = await res.json();
      const coll = data?.results?.[0]?.value;

      if (!coll) {
        return NextResponse.json({
          success: false,
          error: "Invalid or private database (collection not found).",
        });
      }

      // ⭐ THIS IS THE FIX ⭐
      // Collection always has a parent → THAT is the real database page!!
      pageId = cleanId(coll.parent_id);
    }

    // ============================
    // 2. Clean pageId
    // ============================
    pageId = cleanId(pageId);

    // ============================
    // 3. Fetch pageData (with token_v2)
    // ============================
    const res2 = await fetch(
      "https://www.notion.so/api/v3/getPublicPageData",
      {
        method: "POST",
        headers,
        body: JSON.stringify({ pageId }),
      }
    );

    const data2 = await res2.json();

    if (!data2 || data2.error) {
      return NextResponse.json({
        success: false,
        error: "Invalid or private database (cannot resolve collection_view).",
      });
    }

    // Extract block
    const blockMap = data2.recordMap.block;
    const block =
      blockMap?.[pageId] ||
      Object.values(blockMap)[0];

    const blockValue = (block as any)?.value;

    const title =
      blockValue?.properties?.title?.[0]?.[0] || "Untitled Database";

    // Extract collection + view
    const collectionObj = Object.values(data2.recordMap.collection || {})[0];
    const viewObj = Object.values(data2.recordMap.collection_view || {})[0];

    const collection = collectionObj?.value;
    const view = viewObj?.value;

    if (!collection || !view) {
      return NextResponse.json({
        success: false,
        error: "Invalid or private database (missing collection_view).",
      });
    }

    // Extract fields
    const schema = collection.schema || {};
    const schemaCount = Object.keys(schema).length;

    const titleField = Object.keys(schema).find(
      (k) => schema[k].type === "title"
    );
    const imageField = Object.keys(schema).find(
      (k) => schema[k].type === "file"
    );
    const statusField = Object.keys(schema).find(
      (k) => schema[k].type === "select" || schema[k].type === "status"
    );

    const publicUrl = `https://www.notion.so/${pageId}?v=${view.id.replace(/-/g, "")}`;

    return NextResponse.json({
      success: true,
      title,
      icon: blockValue?.format?.page_icon || null,
      dbId: collection.id,
      viewId: view.id,
      viewType: view.type,
      viewName: view.name,
      schemaCount,
      publicUrl,
      fields: {
        titleField,
        imageField,
        statusField,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: "Server error",
    });
  }
}
