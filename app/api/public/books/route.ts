import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/books - Fetch public library
export async function GET() {
    try {
        const books = await (prisma.book as any).findMany({
            orderBy: [
                { featured: "desc" },
                { createdAt: "desc" }
            ]
        });
        return NextResponse.json(books);
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
