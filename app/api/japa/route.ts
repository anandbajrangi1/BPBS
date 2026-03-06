import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST /api/japa — save a chanting session
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { rounds, duration } = await req.json();

        const japaSession = await prisma.japaSession.create({
            data: {
                userId: session.user.id,
                rounds: rounds ?? 0,
                duration: duration ?? 0,
            },
        });

        return NextResponse.json(japaSession, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// GET /api/japa — get session history for current user
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const sessions = await prisma.japaSession.findMany({
            where: { userId: session.user.id },
            orderBy: { date: "desc" },
            take: 30,
        });

        const totalRounds = sessions.reduce((a: number, s: { rounds: number }) => a + s.rounds, 0);
        const todayRounds = sessions
            .filter((s: { date: Date }) => new Date(s.date).toDateString() === new Date().toDateString())
            .reduce((a: number, s: { rounds: number }) => a + s.rounds, 0);

        return NextResponse.json({ sessions, totalRounds, todayRounds });
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
