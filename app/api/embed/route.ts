/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { redis } from "@/app/lib/redis";

export async function POST(req: Request) {
  const { token, db } = await req.json();

  if (!token || !db)
    return NextResponse.json({ error: "Missing token/db" }, { status: 400 });

  const id = randomUUID().slice(0, 6);

  // Simpan token ke Redis
  await redis.set(`notion-token:${id}`, token, {
    ex: 60 * 60 * 2, // expire 2 jam
  });

  // Bangun embed URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const embedUrl = `${baseUrl}/embed/${id}?db=${db}`;

  return NextResponse.json({ success: true, embedUrl });
}

export async function getToken(id: string) {
  return await redis.get<string>(`notion-token:${id}`);
}
