import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/pages/[id] - Fetch single page
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const page = await prisma.page.findUnique({
            where: { id }
        });
        if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
        return NextResponse.json(page);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PATCH /api/pages/[id] - Update page
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        const page = await prisma.page.update({
            where: { id },
            data
        });
        return NextResponse.json(page);
    } catch (err: any) {
        if (err.code === "P2002") {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE /api/pages/[id] - Delete page
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.page.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
