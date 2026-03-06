import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSms(phone: string, otp: string): Promise<boolean> {
    // Dev mode — log OTP instead of sending SMS
    if (process.env.OTP_DEV_MODE === "true") {
        console.log(`[DEV] OTP for ${phone}: ${otp}`);
        return true;
    }

    // Fast2SMS integration (primary)
    if (process.env.FAST2SMS_API_KEY) {
        const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
            method: "POST",
            headers: {
                authorization: process.env.FAST2SMS_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                route: "q",
                message: `Your BPBS OTP is ${otp}. Valid for 5 minutes. Hare Krishna!`,
                language: "english",
                flash: 0,
                numbers: phone.replace("+91", "").replace(/\s/g, ""),
            }),
        });
        const data = await res.json();
        return data.return === true;
    }

    // MSG91 integration (fallback)
    if (process.env.MSG91_AUTH_KEY) {
        const res = await fetch("https://api.msg91.com/api/v5/otp", {
            method: "POST",
            headers: {
                authkey: process.env.MSG91_AUTH_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                template_id: process.env.MSG91_TEMPLATE_ID,
                mobile: `91${phone.replace("+91", "").replace(/\s/g, "")}`,
                otp,
            }),
        });
        const data = await res.json();
        return data.type === "success";
    }

    return false;
}

export async function POST(req: NextRequest) {
    try {
        const { phone } = await req.json();

        if (!phone || !/^\+?[0-9]{10,13}$/.test(phone.replace(/\s/g, ""))) {
            return NextResponse.json(
                { error: "Invalid phone number" },
                { status: 400 }
            );
        }

        // Invalidate old OTPs for this phone
        await prisma.otpToken.updateMany({
            where: { phone, used: false },
            data: { used: true },
        });

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await prisma.otpToken.create({
            data: { phone, otp, expiresAt },
        });

        const sent = await sendSms(phone, otp);

        if (!sent && process.env.OTP_DEV_MODE !== "true") {
            return NextResponse.json(
                { error: "Failed to send OTP. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message:
                process.env.OTP_DEV_MODE === "true"
                    ? `OTP logged to server console (dev mode): ${otp}`
                    : "OTP sent successfully",
        });
    } catch (err) {
        console.error("[OTP SEND]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
