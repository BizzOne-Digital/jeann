import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

const protectedPrefixes = ["/portal/", "/workspace/", "/admin/"];

export function middleware(request: NextRequest) {
  if (!protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix))) {
    return NextResponse.next();
  }
  if (request.cookies.has(SESSION_COOKIE_NAME)) return NextResponse.next();
  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/portal/:path*", "/workspace/:path*", "/admin/:path*"] };
