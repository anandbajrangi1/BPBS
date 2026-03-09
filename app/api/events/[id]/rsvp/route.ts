import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/events/[id]/rsvp - Check status and get attendee count
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const session = await auth();
        const userId = session?.user?.id;

        const [isAttending, attendeeCount] = await Promise.all([
            userId
                ? prisma.eventRSVP.findUnique({
                    where: { userId_eventId: { userId, eventId } }
                })
                : Promise.resolve(null),
            prisma.eventRSVP.count({
                where: { eventId }
            })
        ]);

        return NextResponse.json({
            isAttending: !!isAttending,
            attendeeCount
        });
    } catch (err) {
        console.error("[GET /api/events/[id]/rsvp]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST /api/events/[id]/rsvp - Join an event
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if event exists and RSVP is enabled
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        if (!event.rsvp) {
            return NextResponse.json({ error: "RSVPs are disabled for this event" }, { status: 400 });
        }

        // Create RSVP
        await prisma.eventRSVP.upsert({
            where: { userId_eventId: { userId, eventId } },
            create: { userId, eventId },
            update: {} // Do nothing if already exists
        });

        // Update attendee count cached on event model if needed
        // For now we'll just return success and let the dynamic count handle it

        return NextResponse.json({ message: "RSVP successful" });
    } catch (err) {
        console.error("[POST /api/events/[id]/rsvp]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE /api/events/[id]/rsvp - Leave an event
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        await prisma.eventRSVP.delete({
            where: { userId_eventId: { userId, eventId } }
        });

        return NextResponse.json({ message: "RSVP cancelled" });
    } catch (err) {
        console.error("[DELETE /api/events/[id]/rsvp]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
