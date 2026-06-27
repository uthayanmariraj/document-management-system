import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;


  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }


  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/api/files") || pathname.startsWith("/upload"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/api/files",
    "/api/files/:path*",
    "/upload",
    "/upload/:path*",
    "/login",
    "/register"
  ],
};
