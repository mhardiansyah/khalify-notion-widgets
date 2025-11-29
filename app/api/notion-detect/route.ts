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
    const path = url.pathname; // /slug-2a5ad4... atau /2a5ad4...
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
      error: "Missing database ID.",
    });
  }

  const token = process.env.NOTION_TOKEN_V2;

  if (!token) {
    return NextResponse.json({
      success: false,
      error: "NOTION_TOKEN_V2 is not configured on the server.",
    });
  }

  // Header standar buat semua request ke internal API Notion
  const baseHeaders: HeadersInit = {
    "Content-Type": "application/json;charset=UTF-8",
    // cookie penting buat akses private DB
    Cookie: `token_v2=${token}`,
  };

  try {
    // =========================
    // CASE 1: NEW PUBLIC ID ntn_
    // =========================
    if (id.startsWith("ntn_")) {
      // Banyak tool pakai ntn_ sebagai ID collection,
      // jadi kita coba table "collection" dulu.
      const res = await fetch(
        "https://www.notion.so/api/v3/getRecordValues",
        {
          method: "POST",
          headers: baseHeaders,
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

      const collection: any = (data as any)?.results?.[0]?.value || null;

      if (!collection) {
        return NextResponse.json({
          success: false,
          error: "Database is private or invalid.",
        });
      }

      // Notion style: name = [[ "Text" ]]
      const title: string =
        collection?.name?.[0]?.[0] || "Untitled Database";

      const schema = collection?.schema || {};
      const propertiesCount = Object.keys(schema).length;

      // internal UUID asli → 2a5ad4026b83...
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
        icon: null, // collection biasanya ga punya page_icon
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
        headers: baseHeaders,
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

    const recordMap: any = (data as any).recordMap || {};
    const blockMap: any = recordMap.block || {};

    // block utama (root)
    const blockEntry =
      blockMap[pageId] ||
      blockMap[pageId.replace(/-/g, "")] ||
      Object.values(blockMap)[0];

    const blockValue: any = (blockEntry as any)?.value || blockEntry;

    const title: string =
      blockValue?.properties?.title?.[0]?.[0] || "Untitled Database";

    const icon: string | null =
      blockValue?.format?.page_icon ||
      blockValue?.format?.block_icon ||
      null;

    // Ambil collection pertama (kalau ada)
    const collectionObj: any = recordMap.collection
      ? (Object.values(recordMap.collection)[0] as any)
      : null;

    const collection = collectionObj?.value || null;
    const schema = collection?.schema || {};
    const propertiesCount = Object.keys(schema).length;

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
