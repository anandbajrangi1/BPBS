import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/books - List all books (Admin)
export async function GET() {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const books = await (prisma.book as any).findMany({
            orderBy: { updatedAt: "desc" }
        });
        return NextResponse.json(books);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST /api/books - Create new book
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();

        if (!data.title || !data.author || !data.description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const book = await (prisma.book as any).create({ data });
        return NextResponse.json(book);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
