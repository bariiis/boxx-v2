import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (userRole !== "ADMIN" && userRole !== "EMPLOYEE") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Portal routes - require login
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // Auth pages (redirect if already logged in)
  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      if (userRole === "ADMIN" || userRole === "EMPLOYEE") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      return NextResponse.redirect(new URL("/portal", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/login", "/register"],
}
