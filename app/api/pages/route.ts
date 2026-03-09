import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/pages - List all pages (Admin)
export async function GET() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const pages = await prisma.page.findMany({
            orderBy: { updatedAt: "desc" }
        });
        return NextResponse.json(pages);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST /api/pages - Create new page
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, slug, content } = await req.json();

        if (!title || !slug || !content) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const page = await prisma.page.create({
            data: { title, slug, content }
        });

        return NextResponse.json(page);
    } catch (err: any) {
        if (err.code === "P2002") {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
