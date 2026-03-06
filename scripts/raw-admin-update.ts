import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@bpbs.org";
    const username = "admin";
    const password = "admin123";

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
    console.log(`Password: ${password}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
