export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  try {
    const { token, db } = await req.json();
    if (!token || !db) {
      return NextResponse.json({ error: "Missing token/db" }, { status: 400 });
    }

    // ✅ FIX: cookies() must be awaited in Next.js 16 !!!
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id ?? null;

    const id = Math.random().toString(36).substring(2, 8);

    const { error } = await supabaseAdmin.from("widgets").insert({
      id,
      db,
      token,
      user_id: userId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to store widget", detail: error.message },
        { status: 500 }
      );
    }

    const embedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/embed/${id}?db=${db}`;

    return NextResponse.json({ success: true, embedUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}
