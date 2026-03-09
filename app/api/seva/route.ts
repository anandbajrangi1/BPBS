import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const sevas = await prisma.sevaOpportunity.findMany({
            include: {
                volunteers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                                username: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(sevas);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const seva = await prisma.sevaOpportunity.create({
            data: {
                title: body.title,
                description: body.description,
                date: body.date,
                location: body.location,
                emoji: body.emoji || "🙏",
                color: body.color || "#FFB38E",
            }
        });

        return NextResponse.json(seva, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
