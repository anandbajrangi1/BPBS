import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/reporting", "/japa", "/seva"];

// Routes that require admin role
const ADMIN_ROUTES = ["/admin"];

export default auth((req) => {
    const { nextUrl, auth: session } = req;
    const pathname = nextUrl.pathname;

    const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
    const isProtectedRoute = PROTECTED_ROUTES.some((r) =>
        pathname.startsWith(r)
    );

    // Not logged in → redirect to login
    if ((isProtectedRoute || isAdminRoute) && !session) {
        return NextResponse.redirect(new URL("/login", nextUrl.origin));
    }

    // Logged in but not admin → redirect to home
    if (isAdminRoute && session && (session.user as any).role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-.*\\.png).*)",
    ],
};
