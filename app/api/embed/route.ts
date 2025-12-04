/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // ==== SAFE PARSE BODY ====
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" }, 
        { status: 400 }
      );
    }

    const { token, db } = body;

    if (!token || !db) {
      return NextResponse.json(
        { error: "Missing token or db" },
        { status: 400 }
      );
    }

    // ==== GET USER ID ====
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("sb-access-token")?.value;

    let userId: string | null = null;
    if (accessToken) {
      try {
        const payload = JSON.parse(
          Buffer.from(accessToken.split(".")[1], "base64").toString()
        );
        userId = payload.sub;
      } catch (e) {
        console.error("JWT decode failed:", e);
      }
    }

    const id = randomUUID().slice(0, 6);

    // ==== INSERT WIDGET ====
    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      token,
      db,
      user_id: userId,
      created_at: new Date().toISOString(),  // PASTI KOMPATIBEL
    });

    if (error) {
      console.error("WIDGET INSERT ERROR:", error);
      return NextResponse.json(
        { error: "Failed to store widget", detail: error.message },
        { status: 500 }
      );
    }

    // ==== BASE URL ====
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_BASE_URL in env" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      embedUrl: `${baseUrl}/embed/${id}?db=${db}`,
      id,
      db,
    });

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
