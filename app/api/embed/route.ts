/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { token, db } = await req.json();

  if (!token || !db) {
    return NextResponse.json({ error: "Missing token/db" }, { status: 400 });
  }

  const id = randomUUID().slice(0, 6);

  const { error } = await supabaseAdmin.from("widgets").insert({
    id,
    token,
    db,
    created_at: Date.now(),
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to store token" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const embedUrl = `${baseUrl}/embed/${id}?db=${db}`;

  return NextResponse.json({ success: true, embedUrl });
}

export async function getToken(id: string) {
  const { data, error } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.token;
}
