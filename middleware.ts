import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

/**
 * Middleware proteksi /admin/* (PRD §8) — konfigurasi edge-safe tanpa Prisma.
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = Boolean(req.auth);
  const isLoginPage = pathname === "/admin/login";
  const isPublicAuthPage =
    pathname === "/admin/forgot-password" || pathname === "/admin/reset-password";

  if (pathname.startsWith("/admin") && !isLoginPage && !isPublicAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
