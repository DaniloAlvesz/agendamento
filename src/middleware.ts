import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  if (!isDashboard && !isAdmin) return NextResponse.next();

  const user = req.auth?.user;
  if (!user) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
  }

  if (isDashboard && user.role !== "PROFESSIONAL") {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
