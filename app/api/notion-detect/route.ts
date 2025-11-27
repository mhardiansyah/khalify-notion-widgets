/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, token } = await req.json();

    const res = await fetch(`https://api.notion.com/v1/databases/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (data.object === "error") {
      return NextResponse.json({ success: false, error: data.message });
    }

    return NextResponse.json({
      success: true,
      title: data.title?.[0]?.plain_text || "Untitled",
      icon: data.icon?.emoji || null,
      properties: Object.keys(data.properties || {}),
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
