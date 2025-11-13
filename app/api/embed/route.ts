/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const globalStore = globalThis as any;

if (!globalStore.__tokenStore) {
  globalStore.__tokenStore = new Map<string, string>();
}

const tokenStore: Map<string, string> = globalStore.__tokenStore;


export async function POST(req: Request) {
  const { token, db } = await req.json();

  if (!token || !db)
    return NextResponse.json({ error: "Missing token/db" }, { status: 400 });

  const id = randomUUID().slice(0, 6);

  tokenStore.set(id, token);

  // const embedUrl = `http://localhost:3000/embed/${id}?db=${db}`;
  const embedUrl = `https://khalify-notion-widgets.vercel.app//embed/${id}?db=${db}`;

  return NextResponse.json({ success: true, embedUrl });
}


export function getToken(id: string) {
  return tokenStore.get(id);
}
