import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/users — admin only
export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
                donations: {
                    where: { status: "SUCCESS" },
                    select: { amount: true }
                },
                japaSessions: {
                    select: { rounds: true }
                }
            },
        });

        const mapped = users.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role,
            status: u.status,
            createdAt: u.createdAt,
            japaRounds: u.japaSessions.reduce((acc: number, s: any) => acc + s.rounds, 0),
            totalDonation: u.donations.reduce((acc: number, d: any) => acc + (d.amount / 100), 0)
        }));

        return NextResponse.json(mapped);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PATCH /api/users?id=xxx — update status or role (admin)
export async function PATCH(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

        const body = await req.json();
        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(body.status && { status: body.status }),
                ...(body.role && { role: body.role }),
                ...(body.name && { name: body.name }),
            },
        });
        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
