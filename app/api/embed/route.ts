/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";

// Wajib untuk route handlers
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

    const id = randomUUID().slice(0, 6);

    // ✅ FIX PENTING: cookies harus dibungkus menjadi function sesuai docs
    const supabase = createRouteHandlerClient({
      cookies: () => cookies(),
    });

    // 🔥 Ambil user via Supabase session di server
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    console.log("USER FROM ROUTE:", user, userErr);

    const userId = user?.id ?? null;

    // =========================================
    // SIMPAN WIDGET KE DATABASE
    // =========================================
    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      db,
      token,
      user_id: userId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("INSERT ERROR:", error);
      return NextResponse.json(
        { error: "Failed to store widget" },
        { status: 500 }
      );
    }

    // URL embed final
    const embedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/embed/${id}?db=${db}`;

    return NextResponse.json({ success: true, embedUrl });
  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}

// =========================================
// HELPER BUAT AMBIL TOKEN DARI DB
// =========================================

export async function getToken(id: string) {
  const { data } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  return data?.token ?? null;
}
