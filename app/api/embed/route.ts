/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { token, db } = await req.json();

    if (!token || !db) {
      return NextResponse.json({ error: "Missing token/db" }, { status: 400 });
    }

    const id = randomUUID().slice(0, 6);

    // 🟣 Ambil user_id dari cookie (SESSION)
    // Tidak pakai createRouteHandlerClient
    const cookieStore = cookies();
    const userId = (await cookieStore).get("sb-user")?.value || null;

    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      token,
      db,
      user_id: userId,  // 🟣 STORE USER ID
      created_at: Date.now(),
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to store token" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const embedUrl = `${baseUrl}/embed/${id}?db=${db}`;

    return NextResponse.json({ success: true, embedUrl });
  } catch (err: any) {
    console.log("API ERROR:", err);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}

// SAME AS BEFORE — safe
export async function getToken(id: string) {
  const { data, error } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data.token;
}
