import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
    });
    console.log("Admin User:", JSON.stringify(admin, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
