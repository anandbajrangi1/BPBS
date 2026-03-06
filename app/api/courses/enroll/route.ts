import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { courseId } = await req.json();

        // Create enrollment
        const enrollment = await prisma.courseEnrollment.create({
            data: {
                userId: session.user.id,
                courseId: courseId
            }
        });

        // Increment count on course
        await prisma.course.update({
            where: { id: courseId },
            data: { enrolled: { increment: 1 } }
        });

        return NextResponse.json(enrollment, { status: 201 });
    } catch (err) {
        // Handle duplicate enrollment
        return NextResponse.json({ error: "Already enrolled or server error" }, { status: 400 });
    }
}

// GET /api/courses/enroll — check if user is enrolled or list user's courses
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        if (courseId) {
            const enrollment = await prisma.courseEnrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: session.user.id,
                        courseId: courseId
                    }
                }
            });
            return NextResponse.json({ enrolled: !!enrollment });
        }

        const enrollments = await prisma.courseEnrollment.findMany({
            where: { userId: session.user.id },
            include: { course: true }
        });
        return NextResponse.json(enrollments);
    } catch {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
