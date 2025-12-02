/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { token, db } = await req.json();

    if (!token || !db) {
      return NextResponse.json({ error: "Missing token/db" }, { status: 400 });
    }

    // Create Supabase client (auto handles cookies in Vercel)
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 🔥 Ambil user lewat Supabase (bukan decode JWT manual)
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr) console.error("AUTH ERROR:", authErr);

    const userId = user?.id ?? null;
    console.log("USER ID:", userId);

    // Buat widget id
    const id = randomUUID().slice(0, 6);

    // Insert ke Supabase
    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      token,
      db,
      user_id: userId, // ⭐ sekarang pasti masuk
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

// GET TOKEN
export async function getToken(id: string) {
  const { data, error } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data.token;
}
