import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/books/[id] - Fetch single book public details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const book = await (prisma.book as any).findUnique({ where: { id } });
        if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });
        return NextResponse.json(book);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
