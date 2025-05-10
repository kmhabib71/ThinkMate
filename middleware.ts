import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const pathname = request.nextUrl.pathname;

  // Define paths that are always accessible
  const alwaysAccessiblePaths = [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/_next",
    "/api/auth",
    "/favicon.ico",
    "/images",
    "/public",
  ];

  // Check if the current path is always accessible
  const isPublicPath = alwaysAccessiblePaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  );

  // Check if this is an API route (except auth endpoints)
  const isApiRoute =
    pathname.startsWith("/api/") && !pathname.startsWith("/api/auth");

  // Protected routes that require authentication
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // Handle authentication for protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Handle authentication for protected API routes
  if (isApiRoute && !isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect authenticated users trying to access auth pages
  if (
    isAuthenticated &&
    (pathname === "/auth/sign-in" || pathname === "/auth/sign-up")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. images/ (local images)
     * 5. public/ files
     */
    "/((?!_next/static|_next/image|favicon.ico|images|public).*)",
  ],
};
