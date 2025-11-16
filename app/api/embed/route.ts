/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { kv } from "@vercel/kv";

export async function POST(req: Request) {
  const { token, db } = await req.json();

  if (!token || !db)
    return NextResponse.json({ error: "Missing token/db" }, { status: 400 });

  // slug ID untuk embed
  const id = randomUUID().slice(0, 6);

  // simpan ke Vercel KV
  await kv.set(`widget:${id}`, JSON.stringify({
  token,
  db,
  created_at: Date.now(),
}));


  // URL embed final
  const embedUrl = `https://khalify-notion-widgets.vercel.app/embed/${id}?db=${db}`;

  return NextResponse.json({ success: true, embedUrl });
}

// digunakan di halaman embed
export async function getToken(id: string) {
  const raw = await kv.get(`widget:${id}`);
  if (!raw) return null;

  const data = JSON.parse(raw as string);
  return data.token;
}
