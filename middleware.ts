import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  if (!isMaintenanceMode) {
    return NextResponse.next();
  }

  // Check for bypass cookie — admin can browse normally
  const bypassCookie = request.cookies.get("maintenance_bypass");
  if (bypassCookie?.value === "true") {
    return NextResponse.next();
  }

  // Check for bypass secret in URL query
  const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET || "";
  const url = request.nextUrl;
  const queryBypass = url.searchParams.get("bypass");

  if (queryBypass && queryBypass === bypassSecret) {
    // Set bypass cookie and redirect to clean URL (remove query param)
    url.searchParams.delete("bypass");
    const response = NextResponse.redirect(url);
    response.cookies.set("maintenance_bypass", "true", {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  }

  // Redirect to maintenance page
  const maintenanceUrl = new URL("/maintenance", request.url);
  return NextResponse.rewrite(maintenanceUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /maintenance (the maintenance page itself)
     * - /api (API routes)
     * - /_next/static (static files)
     * - /_next/image (image optimization)
     * - favicon.ico and static assets
     */
    "/((?!maintenance|api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)).*)",
  ],
};
