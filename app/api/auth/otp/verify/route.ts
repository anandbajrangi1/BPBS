import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json(
                { error: "Phone and OTP required" },
                { status: 400 }
            );
        }

        const record = await prisma.otpToken.findFirst({
            where: {
                phone,
                otp,
                used: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!record) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 401 }
            );
        }

        // Mark used
        await prisma.otpToken.update({
            where: { id: record.id },
            data: { used: true },
        });

        return NextResponse.json({ success: true, valid: true });
    } catch (err) {
        console.error("[OTP VERIFY]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
