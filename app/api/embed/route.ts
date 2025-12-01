/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// ---------------- CREATE WIDGET ----------------
export async function POST(req: Request) {
  const { token, db } = await req.json();

  if (!token || !db) {
    return NextResponse.json({ error: "Missing token/db" }, { status: 400 });
  }

  // 🔥 get current logged in user
  const supabase = createServerComponentClient({ cookies });
  const { data: authUser } = await supabase.auth.getUser();

  if (!authUser?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔥 generate short widget id
  const id = randomUUID().slice(0, 6);

  // 🔥 save to DB with user_id
  const { error } = await supabaseAdmin.from("widgets").insert({
    id,
    token,
    db,
    user_id: authUser.user.id, // ⭐ penting
    created_at: Date.now(),
  });

  if (error) {
    console.error("Insert Error:", error);
    return NextResponse.json(
      { error: "Failed to store widget" },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const embedUrl = `${baseUrl}/embed/${id}?db=${db}`;

  return NextResponse.json({ success: true, embedUrl });
}

// --------------- GET TOKEN ----------------
export async function getToken(id: string) {
  const { data, error } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return data.token;
}
