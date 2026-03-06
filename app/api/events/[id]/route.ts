import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/events/[id]
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const event = await prisma.event.findUnique({
            where: { id },
        });
        if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(event);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// PATCH /api/events/[id] — admin only
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        const body = await req.json();
        const event = await prisma.event.update({
            where: { id },
            data: {
                ...(body.title && { title: body.title }),
                ...(body.date && { date: new Date(body.date) }),
                ...(body.venue && { venue: body.venue }),
                ...(body.location && { location: body.location }),
                ...(body.description && { description: body.description }),
                ...(body.category && { category: body.category }),
            },
        });
        return NextResponse.json(event);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE /api/events/[id] — admin only
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        await prisma.event.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
