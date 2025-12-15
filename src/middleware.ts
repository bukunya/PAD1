// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  console.error("🔐 MIDDLEWARE:", pathname);

  // BYPASS: API routes, Next.js internals, static files
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // GET TOKEN (edge-safe, works without Prisma)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isLoggedIn = !!token;

  console.error("👤 Auth Status:", { 
    isLoggedIn, 
    email: token?.email,
    hasSessionCookie: req.cookies.has("authjs.session-token") || req.cookies.has("__Secure-authjs.session-token")
  });

  // Define PUBLIC routes (routes yang bisa diakses tanpa login)
  const publicRoutes = ["/", "/login"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // ========================================
  // RULE 1: Root redirect
  // ========================================
  if (pathname === "/") {
    console.error("🏠 Root page → redirect");
    const redirectTo = isLoggedIn ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // ========================================
  // RULE 2: Already logged in + trying to access /login
  // → Redirect to /dashboard
  // ========================================
  if (isLoggedIn && pathname === "/login") {
    console.error("✅ Logged in + /login → redirect /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ========================================
  // RULE 3: NOT logged in + trying to access protected routes
  // → Redirect to /login with callback
  // ========================================
  if (!isLoggedIn && !isPublicRoute) {
    console.error("❌ Not logged in + protected route → redirect /login");
    const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // ========================================
  // RULE 4: All other cases → allow access
  // ========================================
  console.error("✅ Access allowed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|api/auth|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};