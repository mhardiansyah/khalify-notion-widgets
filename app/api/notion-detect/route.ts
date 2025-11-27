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

    // PRIVATE OR INVALID
    if (!data || data.error || data.type === "error") {
      return NextResponse.json({
        success: false,
        error: "Database is private or invalid.",
      });
    }

    // Ambil nama database + icon
    const record = data?.recordMap?.block?.[id];

    const title =
      record?.value?.properties?.title?.[0]?.[0] || "Untitled Database";

    const icon =
      record?.value?.format?.page_icon ||
      record?.value?.format?.block_icon ||
      null;

    return NextResponse.json({
      success: true,
      title,
      icon,
      raw: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch Notion data.",
    });
  }
}
