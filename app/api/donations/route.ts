import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/donations — user's own history or admin sees all
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const isAdmin = (session.user as any).role === "ADMIN";
        const admin = searchParams.get("admin") === "true";

        if (admin && !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const donations = await prisma.donation.findMany({
            where: admin && isAdmin ? undefined : { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true, phone: true } } },
        });

        return NextResponse.json(donations);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
