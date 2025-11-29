/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

// Helper: cek UUID 32 char (tanpa dash)
function isUuidLike(str: string) {
  const clean = str.replace(/-/g, "");
  return /^[0-9a-fA-F]{32}$/.test(clean);
}

// Helper: ambil 32 hex terakhir dari Notion URL
function extractIdFromUrl(input: string): string | null {
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    const path = url.pathname; // /khasify-Backend-2a7ad4... atau /2a5ad4...
    const slug = path.split("/").filter(Boolean).pop() || "";
    const match = slug.replace(/-/g, "").match(/[0-9a-fA-F]{32}$/);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const { id } = (await req.json()) as { id: string };

  if (!id) {
    return NextResponse.json({
      success: false,
      error: "Missing database ID",
    });
  }

  try {
    // =========================
    // CASE 1: NEW PUBLIC ID ntn_
    // =========================
    if (id.startsWith("ntn_")) {
      // pakai getRecordValues → table: "collection"
      const res = await fetch(
        "https://www.notion.so/api/v3/getRecordValues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            requests: [
              {
                id,
                table: "collection",
              },
            ],
          }),
        }
      );

      const data = await res.json();

      const collection: any = data?.results?.[0]?.value || null;

      if (!collection) {
        return NextResponse.json({
          success: false,
          error: "Database is private or invalid.",
        });
      }

      // title di collection.name (Notion style: [[ "Text" ]])
      const title =
        collection?.name?.[0]?.[0] || "Untitled Database";

      const schema = collection?.schema || {};
      const propertiesCount = Object.keys(schema).length;

      // internal UUID asli → ini yang jadi "2a5ad4026b83..."
      const internalId: string | null = collection?.id || null;
      const cleanInternalId = internalId
        ? internalId.replace(/-/g, "")
        : null;

      const publicUrl = cleanInternalId
        ? `https://www.notion.so/${cleanInternalId}`
        : null;

      return NextResponse.json({
        success: true,
        title,
        icon: null, // collection biasanya nggak punya page_icon; aman dibuat null
        propertiesCount,
        publicUrl,
      });
    }

    // =========================
    // CASE 2: URL / UUID biasa
    // =========================
    let pageId: string | null = null;

    if (id.includes("notion.so")) {
      pageId = extractIdFromUrl(id);
    } else if (isUuidLike(id)) {
      pageId = id.replace(/-/g, "");
    }

    if (!pageId) {
      return NextResponse.json({
        success: false,
        error: "Invalid Notion ID or URL.",
      });
    }

    // Call getPublicPageData dengan pageId (UUID 32 char)
    const res = await fetch(
      "https://www.notion.so/api/v3/getPublicPageData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({ pageId }),
      }
    );

    const data = await res.json();

    if (!data || (data as any).error) {
      return NextResponse.json({
        success: false,
        error: "Database is private or invalid.",
      });
    }

    // block utama (root page)
    const blockMap = (data as any)?.recordMap?.block || {};
    const block =
      blockMap[pageId] ||
      blockMap[pageId.replace(/-/g, "")] ||
      Object.values(blockMap)[0];

    const blockValue: any = (block as any)?.value || block;

    const title =
      blockValue?.properties?.title?.[0]?.[0] || "Untitled Database";

    const icon =
      blockValue?.format?.page_icon ||
      blockValue?.format?.block_icon ||
      null;

    // Ambil collection pertama (kalau ada)
    const collectionObj = (data as any)?.recordMap?.collection
      ? (Object.values(
          (data as any).recordMap.collection
        )[0] as any)
      : null;

    const collection = collectionObj?.value || null;
    const schema = collection?.schema || {};
    const propertiesCount = Object.keys(schema).length;

    // URL publik: pageId yang kita pakai barusan
    const publicUrl = `https://www.notion.so/${pageId}`;

    return NextResponse.json({
      success: true,
      title,
      icon,
      propertiesCount,
      publicUrl,
    });
  } catch (error) {
    console.error("notion-detect error", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch Notion data.",
    });
  }
}
