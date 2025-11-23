import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);

  // 1️⃣ HANDLE ERROR DARI SUPABASE (OTP EXPIRED / INVALID / ACCESS DENIED)
  const supabaseError = url.searchParams.get("error");
  const errorCode = url.searchParams.get("error_code");

  if (supabaseError || errorCode) {
    console.error("Supabase auth error:", url.searchParams.toString());

    if (errorCode === "otp_expired") {
      return NextResponse.redirect("/login?error=otp_expired");
    }

    if (errorCode === "otp_invalid") {
      return NextResponse.redirect("/login?error=otp_invalid");
    }

    return NextResponse.redirect("/login?error=auth_failed");
  }

  // 2️⃣ HANDLE CODE (OTP MAGIC LINK)
  const code = url.searchParams.get("code");

  if (!code) {
    // kadang Supabase gak ngirim code → error
    return NextResponse.redirect("/login?error=missing_code");
  }

  const supabase = createRouteHandlerClient({ cookies });

  const {
    error: exchangeError
  } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Exchange error:", exchangeError?.message);

    // klo otp udah expired
    if (exchangeError.message?.includes("expired")) {
      return NextResponse.redirect("/login?error=otp_expired");
    }

    // klo otp invalid
    if (exchangeError.message?.includes("invalid")) {
      return NextResponse.redirect("/login?error=otp_invalid");
    }

    return NextResponse.redirect("/login?error=session_failed");
  }

  // 3️⃣ SUKSES — REDIRECT KE DASHBOARD
  return NextResponse.redirect("/dashboard");
}
