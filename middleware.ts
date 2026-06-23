import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 1. Get the session token from the request cookies
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 2. If the user is logged in, block them from visiting /login or /register
  // and redirect them to the /dashboard instead.
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. If the user is NOT logged in, block them from visiting /dashboard or /api/files
  // and redirect them to /login instead.
  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/api/files"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request to proceed normally
  return NextResponse.next();
}

// Configure the exact paths this middleware should run on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/files/:path*",
    "/login",
    "/register"
  ],
};
