import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin/schedule") && !path.startsWith("/admin/schdule")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await verifyAdminSession(sessionCookie)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/schedule/:path*", "/admin/schdule/:path*"],
};
