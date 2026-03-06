import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "Phone OTP",
            credentials: {
                phone: { label: "Phone", type: "text" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials) {
                const { phone, otp } = credentials as {
                    phone: string;
                    otp: string;
                };

                if (!phone || !otp) return null;

                const record = await prisma.otpToken.findFirst({
                    where: {
                        phone,
                        otp,
                        used: false,
                        expiresAt: { gt: new Date() },
                    },
                    orderBy: { createdAt: "desc" },
                });

                if (!record) return null;

                await prisma.otpToken.update({
                    where: { id: record.id },
                    data: { used: true },
                });

                let user = await prisma.user.findUnique({ where: { phone } });
                if (!user) {
                    user = await prisma.user.create({
                        data: { phone, name: "Devotee" },
                    });
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                };
            },
        }),
    ],
});
