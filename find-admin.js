const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: "admin@bpbs.org" },
        select: { id: true, username: true, email: true }
    });
    console.log(JSON.stringify(admin, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
