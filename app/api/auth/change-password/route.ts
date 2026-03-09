import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { oldPassword, newPassword } = await req.json();

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "User not found or no password set" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Incorrect old password" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ success: true, message: "Password changed successfully" });
    } catch (err) {
        console.error("[CHANGE_PASSWORD_ERROR]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
