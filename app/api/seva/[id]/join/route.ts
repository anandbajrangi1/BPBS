import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sevaOpportunityId } = await params;

        // Check if seva opportunity exists
        const seva = await prisma.sevaOpportunity.findUnique({
            where: { id: sevaOpportunityId }
        });

        if (!seva) {
            return NextResponse.json({ error: "Seva opportunity not found" }, { status: 404 });
        }

        // Create volunteer record (unique constraint will prevent duplicates)
        const volunteer = await prisma.sevaVolunteer.upsert({
            where: {
                userId_sevaOpportunityId: {
                    userId: session.user.id,
                    sevaOpportunityId
                }
            },
            update: {},
            create: {
                userId: session.user.id,
                sevaOpportunityId
            }
        });

        return NextResponse.json({ success: true, volunteer });
    } catch (error) {
        console.error("Seva Join Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
