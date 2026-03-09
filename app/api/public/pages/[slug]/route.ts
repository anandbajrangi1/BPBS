import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/pages/[slug] - Fetch page by slug (Public)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    try {
        const page = await prisma.page.findUnique({
            where: { slug }
        });
        if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
        return NextResponse.json(page);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
