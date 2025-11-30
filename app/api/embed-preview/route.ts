/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { queryDatabase } from "@/app/lib/notion-server";
import { getToken } from "@/app/api/embed/route";

export async function POST(req: Request) {
  const { id, db } = await req.json();

  if (!id || !db) {
    return NextResponse.json({ success: false, error: "Missing id/db" });
  }

  const token = await getToken(id);
  if (!token) {
    return NextResponse.json({ success: false, error: "Token not found" });
  }

  try {
    let data = await queryDatabase(token, db);
    data = data.filter((item: any) => item.properties?.Hide?.checkbox !== true);

    return NextResponse.json({
      success: true,
      items: data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
