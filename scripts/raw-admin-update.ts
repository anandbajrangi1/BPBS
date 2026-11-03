import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = process.env.ADMIN_EMAIL || "admin@bpbs.org";
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        console.error("❌ Set ADMIN_PASSWORD (and optionally ADMIN_USERNAME / ADMIN_EMAIL) before running this script.");
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Using executeRaw to bypass Prisma client type issues
    await prisma.$executeRaw`
        UPDATE "User" 
        SET username = ${username}, 
            password = ${hashedPassword} 
        WHERE email = ${email}
    `;

    console.log(`✅ Admin updated with raw SQL!`);
    console.log(`Username: ${username}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
