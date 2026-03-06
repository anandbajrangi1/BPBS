import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [], // configured in auth.ts (node runtime)
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role ?? "USER";
                token.phone = (user as any).phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role;
                (session.user as any).phone = token.phone;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
