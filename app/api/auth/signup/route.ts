import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { username, name, email, phone, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Check if username, email, or phone already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    ...(email ? [{ email }] : []),
                    ...(phone ? [{ phone }] : [])
                ]
            },
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return NextResponse.json({ error: "Username already taken" }, { status: 400 });
            }
            if (email && existingUser.email === email) {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }
            if (phone && existingUser.phone === phone) {
                return NextResponse.json({ error: "Phone number already in use" }, { status: 400 });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                name,
                email,
                phone,
                password: hashedPassword,
                role: "USER", // Default role
            },
        });

        return NextResponse.json(
            { success: true, user: { id: user.id, username: user.username } },
            { status: 201 }
        );
    } catch (err) {
        console.error("[SIGNUP_ERROR]", err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
