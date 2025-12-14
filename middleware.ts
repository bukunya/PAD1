// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔐 MIDDLEWARE:", pathname);

  // Check if user has session token
  const sessionToken = 
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const hasSession = !!sessionToken;

  console.log("👤 Has session:", hasSession);

  // AUTH routes (login, register)
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  // PROTECTED routes
  const isProtectedRoute = pathname.startsWith("/dashboard");

  // RULE 1: Punya session + akses /login = redirect dashboard
  if (hasSession && isAuthRoute) {
    console.log("✅ Has session → redirect /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // RULE 2: Ga punya session + akses /dashboard = redirect login
  if (!hasSession && isProtectedRoute) {
    console.log("❌ No session → redirect /login");
    
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    
    const response = NextResponse.redirect(loginUrl);
    
    // No-cache headers
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    
    return response;
  }

  console.log("✅ Access allowed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};