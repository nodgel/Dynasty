import { NextResponse, type NextRequest } from "next/server";
import { verifySessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow the login page itself + the auth API route through unauthenticated.
  if (pathname === "/admin/login" || pathname.startsWith("/admin/_")) {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = verifySessionCookieValue(cookie);
    if (!session) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
