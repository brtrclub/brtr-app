import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get("host") || ""

  // Get the subdomain (e.g., "quickreply" from "quickreply.brtr.club")
  let subdomain = ""

  if (hostname.includes(".brtr.club")) {
    subdomain = hostname.split(".brtr.club")[0]
  } else if (hostname.includes(".localhost:")) {
    // Handle localhost:3000 subdomains for local testing
    subdomain = hostname.split(".localhost")[0]
  }

  // Skip if no subdomain or if it's the app subdomain (app.brtr.club is the main admin)
  if (!subdomain || subdomain === "www") {
    return NextResponse.next()
  }

  // app.brtr.club - this is the main admin/app dashboard, no rewriting needed
  if (subdomain === "app") {
    return NextResponse.next()
  }

  // Company subdomains (e.g., quickreply.brtr.club)
  // Rewrite to add company context
  if (
    !url.pathname.startsWith("/api") &&
    !url.pathname.startsWith("/_next") &&
    !url.pathname.startsWith("/favicon") &&
    !url.pathname.startsWith("/admin") // Don't rewrite admin routes
  ) {
    // If accessing root of subdomain, go to login
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/login"
      url.searchParams.set("company", subdomain)
      return NextResponse.rewrite(url)
    }

    // For dashboard routes, add company context
    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/mentors") ||
      url.pathname.startsWith("/sessions") ||
      url.pathname.startsWith("/planning") ||
      url.pathname.startsWith("/team") ||
      url.pathname.startsWith("/settings") ||
      url.pathname.startsWith("/explore") ||
      url.pathname.startsWith("/login")
    ) {
      url.searchParams.set("company", subdomain)
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
}
