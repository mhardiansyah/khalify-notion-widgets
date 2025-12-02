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

    // ❗ TIDAK BOLEH pakai await
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

    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      token,
      db,
      user_id: userId,
      created_at: Date.now(),
    });

    if (error) {
      console.error("INSERT ERROR:", error);
      return NextResponse.json(
        { error: "Failed to store widget" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const embedUrl = `${baseUrl}/embed/${id}?db=${db}`;

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
  const { data, error } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data.token;
}
