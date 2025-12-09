export const runtime = "nodejs";

import { NextResponse } from "next/server";
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

    // ⬅️ FIX UTAMA: cukup passing cookies (BUKAN cookies())
    const supabase = createRouteHandlerClient({ cookies });

    // ⬅️ UPDATED: panggil getUser
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("USER FROM SERVER:", user);

    const id = Math.random().toString(36).substring(2, 8);

    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      db,
      token,
      user_id: user?.id ?? null,
      created_at: Date.now(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to store widget", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      embedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/embed/${id}?db=${db}`,
    });

  } catch (err: any) {
    console.error("SERVER ERROR:", err.message);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}
