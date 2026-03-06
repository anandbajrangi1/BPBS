import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const course = await prisma.course.findUnique({
            where: { id },
            include: { lessons: true }
        });
        if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(course);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const { lessons, ...data } = await req.json();
    const course = await prisma.course.update({ where: { id }, data });
    return NextResponse.json(course);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
