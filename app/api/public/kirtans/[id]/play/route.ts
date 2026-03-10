import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const kirtan = await (prisma.kirtan as any).update({
            where: { id },
            data: { plays: { increment: 1 } },
        });
        return NextResponse.json({ success: true, plays: kirtan.plays });
    } catch (err) {
        return NextResponse.json({ error: "Failed to update play count" }, { status: 500 });
    }
}
