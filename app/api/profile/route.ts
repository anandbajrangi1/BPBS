import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { name, email, phone } = await req.json();

        // Check for duplicates if email or phone is changing
        if (email || phone) {
            const existing = await prisma.user.findFirst({
                where: {
                    OR: [
                        ...(email ? [{ email }] : []),
                        ...(phone ? [{ phone }] : [])
                    ],
                    NOT: { id: userId }
                }
            });

            if (existing) {
                if (email && existing.email === email) {
                    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
                }
                if (phone && existing.phone === phone) {
                    return NextResponse.json({ error: "Phone number already in use" }, { status: 400 });
                }
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(phone !== undefined && { phone }),
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone
            }
        });
    } catch (err) {
        console.error("[PROFILE_UPDATE_ERROR]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
