/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";

// ⭐ FIX: import resmi Supabase server client
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

    // ⭐ FIX UTAMA → AMBIL USER PAKAI CARA RESMI
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id ?? null;

    console.log("USER ID DETECTED SERVER:", userId);

    // SIMPAN WIDGET (dengan user_id yang benar)
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

export async function getToken(id: string) {
  const { data } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  return data?.token ?? null;
}
