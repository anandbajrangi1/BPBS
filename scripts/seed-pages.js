const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const pages = [
        {
            title: "About BPBS",
            slug: "about-us",
            content: `
                <p>Welcome to <strong>Bhakti Pravaha Bhaktisiddhanta (BPBS)</strong>.</p>
                <p>Ours is a community dedicated to the practice of Krishna Consciousness as taught by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada.</p>
                <p>Our mission is to spread the message of the Bhagavad Gita and provide a platform for spiritual growth through Nama Seva, Shravanam, and Kirtanam.</p>
            `
        },
        {
            title: "Privacy Policy",
            slug: "privacy-policy",
            content: `
                <p>At BPBS, we value your privacy.</p>
                <p>We only collect data necessary for providing our spiritual services, such as your japa history and course progress.</p>
                <p>Your information is never shared with third parties for commercial purposes.</p>
            `
        },
        {
            title: "Contact Us",
            slug: "contact-us",
            content: `
                <p>We are here to serve you.</p>
                <p><strong>Main Ashram:</strong> 108 Bhakti Lane, Spiritual City, MH, India</p>
                <p><strong>Email:</strong> reachout@bpbs.org</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
            `
        }
    ];

    for (const page of pages) {
        await prisma.page.upsert({
            where: { slug: page.slug },
            update: {},
            create: page
        });
    }

    console.log("✅ Initial pages seeded!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
