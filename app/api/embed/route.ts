/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";

// =============================
// POST → CREATE NEW WIDGET
// =============================
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { token, db } = body;

    if (!token || !db) {
      return NextResponse.json(
        { error: "Missing token/db" },
        { status: 400 }
      );
    }

    const id = randomUUID().slice(0, 6);

    // ================================
    // GET USER_ID FROM SUPABASE COOKIE
    // ================================
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;

    let userId: string | null = null;

    if (accessToken) {
      try {
        const payload = JSON.parse(
          Buffer.from(accessToken.split(".")[1], "base64").toString()
        );
        userId = payload.sub;
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    }

    // ================================
    // INSERT WIDGET
    // ================================
    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      token,
      db,
      user_id: userId,
      created_at: Date.now(),   // ⭐ BIGINT FIX
    });

    if (error) {
      console.error("INSERT ERROR:", error);
      return NextResponse.json(
        { error: "Failed to store widget", detail: error.message },
        { status: 500 }
      );
    }

    // ================================
    // RETURN EMBED URL
    // ================================
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      console.error("Missing NEXT_PUBLIC_BASE_URL");
      return NextResponse.json(
        { error: "Missing environment BASE_URL" },
        { status: 500 }
      );
    }

    const embedUrl = `${baseUrl}/embed/${id}?db=${db}`;

    return NextResponse.json({
      success: true,
      id,
      db,
      embedUrl,
    });

  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}

// =============================
// GET TOKEN BY WIDGET ID
// =============================
export async function getToken(id: string) {
  const { data, error } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getToken error:", error);
    return null;
  }

  return data?.token ?? null;
}
