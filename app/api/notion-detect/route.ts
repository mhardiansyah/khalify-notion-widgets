/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // biar bisa pake node fetch + env

// Cek UUID 32 char (tanpa dash)
function isUuidLike(str: string) {
  const clean = str.replace(/-/g, "");
  return /^[0-9a-fA-F]{32}$/.test(clean);
}

// Ambil 32 hex terakhir dari Notion URL
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
      error: "Missing database ID.",
    });
  }

  const token = process.env.NOTION_TOKEN_V2;
  if (!token) {
    // Kalau .env belum diisi
    return NextResponse.json({
      success: false,
      error: "NOTION_TOKEN_V2 is not configured on the server.",
    });
  }

  try {
    // =========================
    // CASE 1: NEW PUBLIC DB ID (ntn_...)
    // DB private tapi bisa diakses via token_v2
    // =========================
    if (id.startsWith("ntn_")) {
      const res = await fetch("https://www.notion.so/api/v3/getRecordValues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          // kunci: token_v2 dikirim via cookie
          cookie: `token_v2=${token};`,
        },
        body: JSON.stringify({
          requests: [
            {
              id, // langsung pakai ntn_... sebagai collection id
              table: "collection",
            },
          ],
        }),
      });

      const data = await res.json();

      const collection: any = data?.results?.[0]?.value || null;

      if (!collection) {
        return NextResponse.json({
          success: false,
          error: "Database is private or invalid.",
        });
      }

      const title =
        collection?.name?.[0]?.[0] || "Untitled Database";

      const schema = collection?.schema || {};
      const propertiesCount = Object.keys(schema).length;

      // internal UUID asli → "2a5ad4026b83..."
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
        icon: null, // collection jarang punya icon sendiri, aman null
        propertiesCount,
        publicUrl,
      });
    }

    // =========================
    // CASE 2: URL / UUID PUBLIC
    // (tanpa token, pakai getPublicPageData)
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
        error:
          "Database is private or invalid. Make sure it is shared publicly.",
      });
    }

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

    const collectionObj = (data as any)?.recordMap?.collection
      ? (Object.values((data as any).recordMap.collection)[0] as any)
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
