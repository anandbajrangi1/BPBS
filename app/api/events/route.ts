import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/events — list all events
export async function GET(req: NextRequest) {
    try {
        const events = await (prisma.event as any).findMany({
            include: {
                _count: {
                    select: { rsvps: true }
                }
            },
            orderBy: { date: "asc" },
        });

        // Map _count.rsvps to attendees for compatibility with existing UI
        const mappedEvents = (events as any[]).map((e: any) => ({
            ...e,
            attendees: e._count?.rsvps || 0
        }));

        return NextResponse.json(mappedEvents);
    } catch (err) {
        console.error("[GET /api/events]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST /api/events — create event (admin only)
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const event = await prisma.event.create({
            data: {
                title: body.title,
                date: new Date(body.date),
                venue: body.venue,
                location: body.location,
                description: body.description,
                category: body.category ?? "Festival",
                rsvp: body.rsvp ?? true,
                image: body.image ?? null,
            },
        });
        return NextResponse.json(event, { status: 201 });
    } catch (err) {
        console.error("[POST /api/events]", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
