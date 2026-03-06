import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// PATCH /api/kirtans/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const kirtan = await prisma.kirtan.update({
            where: { id },
            data: {
                ...(body.featured !== undefined && { featured: body.featured }),
                ...(body.plays !== undefined && { plays: body.plays }),
            },
        });
        return NextResponse.json(kirtan);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE /api/kirtans/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await prisma.kirtan.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
