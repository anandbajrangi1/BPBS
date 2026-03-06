import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// GET /api/courses/[id]/progress - Returns user's course progress
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: courseId } = await params;
    try {
        const progress = await prisma.lessonProgress.findMany({
            where: {
                userId: session.user.id,
                lesson: { courseId },
            },
            include: { lesson: true },
        });

        const totalLessons = await prisma.lesson.count({ where: { courseId } });
        const completedLessons = progress.filter((p: any) => p.completed).length;
        const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return NextResponse.json({
            completedIds: progress.filter((p: any) => p.completed).map((p: any) => p.lessonId),
            totalLessons,
            completedCount: completedLessons,
            percentage,
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
    }
}

// POST /api/courses/[id]/progress - Mark a lesson as complete
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { lessonId, completed = true } = body;

        const progress = await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId,
                },
            },
            update: { completed },
            create: {
                userId: session.user.id,
                lessonId,
                completed,
            },
        });

        return NextResponse.json(progress);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
    }
}
