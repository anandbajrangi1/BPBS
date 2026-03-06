import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const session = await auth();
        const { amount, purpose, donorName, donorPhone } = await req.json();

        if (!amount || amount < 1) {
            return NextResponse.json(
                { error: "Minimum donation is ₹1" },
                { status: 400 }
            );
        }

        // amount is in rupees, Razorpay expects paise
        const amountPaise = Math.round(amount * 100);

        const order = await razorpay.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: `bpbs_${Date.now()}`,
            notes: { purpose, donorName: donorName ?? "", donorPhone: donorPhone ?? "" },
        });

        // Pre-create a PENDING donation record
        const donation = await prisma.donation.create({
            data: {
                userId: session?.user?.id ?? null,
                amount: amountPaise,
                purpose,
                donorName: donorName ?? null,
                donorPhone: donorPhone ?? null,
                razorpayOrderId: order.id as string,
                status: "PENDING",
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: amountPaise,
            currency: "INR",
            donationId: donation.id,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("[RAZORPAY CREATE ORDER]", err);
        return NextResponse.json(
            { error: "Failed to create payment order" },
            { status: 500 }
        );
    }
}
