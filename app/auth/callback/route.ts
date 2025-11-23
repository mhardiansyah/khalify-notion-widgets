import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);

  // handle Supabase errors from URL (otp_expired)
  const error = url.searchParams.get("error");
  if (error) {
    console.error("Supabase auth error:", url.searchParams.toString());
    return NextResponse.redirect("/login?error=otp_expired");
  }

  const code = url.searchParams.get("code");
  const supabase = createRouteHandlerClient({ cookies });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange error:", error);
      return NextResponse.redirect("/login?error=session");
    }
  }

  return NextResponse.redirect("/dashboard");
}
