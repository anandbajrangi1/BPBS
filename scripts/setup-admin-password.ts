import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string) => new Promise<string>(resolve => rl.question(query, resolve));

async function main() {
    console.log("--- BPBS Admin Password Setup ---");
    const email = "admin@bpbs.org"; // Detected existing admin email

    const username = await question("Enter new admin username (e.g. admin_bpbs): ");
    const password = await question("Enter new admin password: ");

    if (!username || !password) {
        console.error("Username and password are required.");
        process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
        where: { email },
        data: {
            username: username.trim(),
            password: hashedPassword
        }
    }) as any;

    console.log(`\n✅ Success! Admin account updated.`);
    console.log(`ID: ${user.id}`);
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log("\nYou can now login with these credentials! Hare Krishna! 🙏");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        rl.close();
        await prisma.$disconnect();
    });
