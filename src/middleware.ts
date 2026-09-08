import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow root / home page
  if (pathname === "/") {
    return NextResponse.next()
  }

  // Redirect any other route to home page
  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next (static files, image optimization, internal bundles)
     * - og (open graph image generation)
     * - files with file extensions (e.g. .ico, .svg, .png, .jpg, .webmanifest, .txt, .xml, .json)
     */
    "/((?!api|_next|og|.*\\.[\\w]+$).*)",
  ],
}
