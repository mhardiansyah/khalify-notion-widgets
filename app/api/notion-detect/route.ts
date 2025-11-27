/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const token = process.env.NOTION_TOKEN; // SERVER-SIDE TOKEN ✔

    if (!token) {
      return NextResponse.json({
        success: false,
        error: "Server missing NOTION_TOKEN",
      });
    }

    const res = await fetch(`https://api.notion.com/v1/databases/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
      },
    });

    const data = await res.json();

    if (data.object === "error") {
      return NextResponse.json({
        success: false,
        error: data.message || "Invalid database ID",
      });
    }

    return NextResponse.json({
      success: true,
      title: data.title?.[0]?.plain_text || "Untitled",
      icon: data.icon?.emoji || null,
      properties: Object.keys(data.properties || {}),
    });

  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
    });
  }
}
