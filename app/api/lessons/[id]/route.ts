import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// PATCH /api/lessons/[id] - Update a lesson (Admin only)
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const user = session?.user as any;
    if (user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    try {
        const body = await req.json();
        const lesson = await prisma.lesson.update({
            where: { id },
            data: body,
        });
        return NextResponse.json(lesson);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
    }
}

// DELETE /api/lessons/[id] - Delete a lesson (Admin only)
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const user = session?.user as any;
    if (user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    try {
        await prisma.lesson.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Lesson deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
    }
}
