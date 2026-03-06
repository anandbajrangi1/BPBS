import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const slides = await prisma.slide.findMany({ orderBy: { order: "asc" } });
        return NextResponse.json(slides);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const slide = await prisma.slide.create({ data: body });
    return NextResponse.json(slide, { status: 201 });
}
