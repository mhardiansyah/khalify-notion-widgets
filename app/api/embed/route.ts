export const dynamic = "force-dynamic";
export const runtime = "edge";
export const fetchCache = "force-no-store";
export const revalidate = 0;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  try {
    const { token, db } = await req.json();

    if (!token || !db) {
      return NextResponse.json(
        { error: "Missing token/db" },
        { status: 400 }
      );
    }

    // ================================
    // 1️⃣ Ambil user dari cookies (Supabase)
    // ================================
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    console.log("🔵 [SERVER] USER RESULT:", user);
    console.log("🔴 [SERVER] USER ERROR:", userErr);

    const userId = user?.id ?? null;

    // ================================
    // 2️⃣ Generate widget ID
    // ================================
    const id = randomUUID().slice(0, 6);

    // ================================
    // 3️⃣ Insert ke DB via admin client
    // ================================
    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      db,
      token,
      user_id: userId,
      created_at: Date.now(),
    });

    if (error) {
      console.error("❌ INSERT ERROR:", error);
      return NextResponse.json(
        {
          error: "Failed to store widget",
          detail: error.message,
        },
        { status: 500 }
      );
    }

    // ================================
    // 4️⃣ Return embed URL
    // ================================
    const embedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/embed/${id}?db=${db}`;

    return NextResponse.json({
      success: true,
      embedUrl,
      userId, // debug
    });

  } catch (err: any) {
    console.error("🔥 SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}

export async function getToken(id: string) {
  const { data } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  return data?.token ?? null;
}
