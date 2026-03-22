import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get("host") || ""

  // Get the subdomain (e.g., "quickreply" from "quickreply.brtr.club")
  // Also handle localhost for development
  let subdomain = ""

  if (hostname.includes(".brtr.club")) {
    subdomain = hostname.split(".brtr.club")[0]
  } else if (hostname.includes(".localhost")) {
    subdomain = hostname.split(".localhost")[0]
  } else if (hostname.includes(".vercel.app")) {
    // For Vercel preview URLs, check for subdomain pattern
    const parts = hostname.split(".")
    if (parts.length > 2 && parts[0] !== "brtr-app") {
      subdomain = parts[0]
    }
  }

  // If we have a subdomain (like quickreply.brtr.club)
  if (subdomain && subdomain !== "www" && subdomain !== "brtr-app") {
    // Rewrite to the login page with company parameter
    // But allow access to API routes and static files
    if (
      !url.pathname.startsWith("/api") &&
      !url.pathname.startsWith("/_next") &&
      !url.pathname.startsWith("/favicon")
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
        url.pathname.startsWith("/explore")
      ) {
        url.searchParams.set("company", subdomain)
        return NextResponse.rewrite(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
}
