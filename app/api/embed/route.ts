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

    // Generate widget ID (6 chars)
    const id = randomUUID().slice(0, 6);

    // CORRECT USAGE FOR API ROUTES
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error("AUTH ERROR:", authErr);
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Insert widget
    const { error: insertErr } = await supabaseAdmin.from("widgets").insert({
      id,
      token,
      db,
      user_id: user.id,
      created_at: Date.now(),
    });

    if (insertErr) {
      console.error("INSERT ERROR:", insertErr);
      return NextResponse.json(
        { error: "Failed to store widget" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const embedUrl = `${baseUrl}/embed/${id}?db=${db}`;

    return NextResponse.json({
      success: true,
      embedUrl,
    });

  } catch (err: any) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}

// GET TOKEN (unchanged)
export async function getToken(id: string) {
  const { data, error } = await supabaseAdmin
    .from("widgets")
    .select("token")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data.token;
}
