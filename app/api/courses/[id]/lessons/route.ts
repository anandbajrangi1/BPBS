import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// GET /api/courses/[id]/lessons - List all lessons for a course
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: courseId } = await params;
    try {
        const lessons = await prisma.lesson.findMany({
            where: { courseId },
            orderBy: { order: "asc" },
        });
        return NextResponse.json(lessons);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
    }
}

// POST /api/courses/[id]/lessons - Add a new lesson (Admin only)
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const user = session?.user as any;
    if (user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: courseId } = await params;
    try {
        const body = await req.json();
        const { title, description, videoUrl, content, order } = body;

        const lesson = await prisma.lesson.create({
            data: {
                courseId,
                title,
                description,
                videoUrl,
                content,
                order: order || 0,
            },
        });
        return NextResponse.json(lesson);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
    }
}
