import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/events/[id]/attendees - List all RSVPs for an event (Admin only)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: eventId } = await params;

        const attendees = await prisma.eventRSVP.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        phone: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(attendees.map(a => ({
            ...a.user,
            rsvpDate: a.createdAt
        })));
    } catch (err) {
        console.error("[GET /api/events/[id]/attendees]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
