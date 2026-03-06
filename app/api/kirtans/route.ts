import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const kirtans = await prisma.kirtan.findMany({ orderBy: { plays: "desc" } });
        return NextResponse.json(kirtans);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const kirtan = await prisma.kirtan.create({ data: body });
    return NextResponse.json(kirtan, { status: 201 });
}
