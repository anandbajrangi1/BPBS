import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { orderId, paymentId, signature, donationId } = await req.json();

        // Verify Razorpay signature
        const body = `${orderId}|${paymentId}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            await prisma.donation.update({
                where: { razorpayOrderId: orderId },
                data: { status: "FAILED" },
            });
            return NextResponse.json(
                { error: "Payment verification failed" },
                { status: 400 }
            );
        }

        // Payment verified — update donation record
        const donation = await prisma.donation.update({
            where: { razorpayOrderId: orderId },
            data: {
                razorpayPaymentId: paymentId,
                razorpaySignature: signature,
                status: "SUCCESS",
            },
        });

        return NextResponse.json({
            success: true,
            donationId: donation.id,
            amount: donation.amount / 100, // convert paise back to rupees
        });
    } catch (err) {
        console.error("[RAZORPAY VERIFY]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
