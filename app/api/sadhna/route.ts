import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const report = await prisma.sadhnaReport.create({
            data: {
                userId: session.user.id,
                sleepTime: body.sleepTime || null,
                wakeUpTime: body.wakeUpTime || null,
                rounds: Number(body.rounds) || 0,
                readingHours: Number(body.readingHours) || 0,
                hearingHours: Number(body.hearingHours) || 0,
                remarks: body.remarks || null,
            },
        });

        return NextResponse.json({ success: true, report }, { status: 201 });
    } catch (error) {
        console.error("Sadhna Report Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const reports = await prisma.sadhnaReport.findMany({
            where: { userId: session.user.id },
            orderBy: { date: "desc" },
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Sadhna Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
