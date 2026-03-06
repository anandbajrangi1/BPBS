// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌸 Seeding BPBS database…");

    // Seed Events
    await prisma.event.createMany({
        skipDuplicates: true,
        data: [
            {
                title: "Janmashtami 2026 — Grand Festival",
                date: new Date("2026-08-16"),
                venue: "ISKCON Temple Auditorium",
                location: "Mumbai",
                description: "Celebrate the divine appearance day of Lord Krishna with grand kirtans, prasad, drama performances, and spiritual discourses.",
                category: "Festival",
                rsvp: true,
                attendees: 500,
            },
            {
                title: "Bhagavad Gita Study Camp",
                date: new Date("2026-04-10"),
                venue: "BPBS Ashram",
                location: "Pune",
                description: "5-day intensive study camp on Bhagavad Gita with senior devotees. All meals and accommodation included.",
                category: "Camp",
                rsvp: true,
                attendees: 80,
            },
            {
                title: "Harinam Sankirtan Walk",
                date: new Date("2026-03-20"),
                venue: "Marine Drive",
                location: "Mumbai",
                description: "Monthly public Harinam — chanting the holy names on the streets. All devotees welcome.",
                category: "Festival",
                rsvp: false,
                attendees: 120,
            },
        ],
    });

    // Seed Courses
    await prisma.course.createMany({
        skipDuplicates: true,
        data: [
            {
                title: "Bhagavad Gita — As It Is",
                instructor: "HG Radheshyam Das",
                lessons: 18,
                duration: "12 hours",
                level: "Beginner",
                enrolled: 1240,
                rating: 4.9,
                description: "A complete chapter-by-chapter study of the Bhagavad Gita with Srila Prabhupada's purports.",
                featured: true,
            },
            {
                title: "Japa Meditation Mastery",
                instructor: "HG Amogh Lila Das",
                lessons: 12,
                duration: "6 hours",
                level: "Beginner",
                enrolled: 890,
                rating: 4.8,
                description: "Learn the science of Japa meditation. Improve quality, quantity and consciousness of your chanting.",
                featured: true,
            },
            {
                title: "Srimad Bhagavatam Overview",
                instructor: "HH Radhanath Swami",
                lessons: 24,
                duration: "20 hours",
                level: "Intermediate",
                enrolled: 650,
                rating: 5.0,
                description: "An in-depth exploration of the Srimad Bhagavatam with stories of great devotees.",
                featured: false,
            },
        ],
    });

    // Seed Kirtans
    await prisma.kirtan.createMany({
        skipDuplicates: true,
        data: [
            { title: "Hare Krishna Mahamantra", artist: "HH Indradyumna Swami", duration: "18:24", type: "kirtan", plays: 5420, featured: true },
            { title: "Govinda Jaya Jaya", artist: "Matunga Das", duration: "8:12", type: "bhajan", plays: 3200, featured: true },
            { title: "Damodarashtakam", artist: "HH Bhakti Charu Swami", duration: "12:00", type: "stotra", plays: 2890, featured: false },
            { title: "Sri Ram Jai Ram", artist: "ISKCON Choir", duration: "10:30", type: "kirtan", plays: 2100, featured: false },
            { title: "Jaya Radha Madhava", artist: "Srila Prabhupada", duration: "6:45", type: "bhajan", plays: 4100, featured: true },
        ],
    });

    // Seed Slides
    await prisma.slide.createMany({
        skipDuplicates: true,
        data: [
            { title: "Bhagavad Gita Course", subtitle: "Begin your spiritual journey", link: "/courses", color: "#FFDA6C", order: 0 },
            { title: "Daily Japa", subtitle: "Chant 16 rounds daily", link: "/japa", color: "#FFB38E", order: 1 },
            { title: "Janmashtami 2026", subtitle: "Register for the grand festival", link: "/events", color: "#c8f5c8", order: 2 },
        ],
    });

    // Create a test admin user (update email to your google account)
    const admin = await prisma.user.upsert({
        where: { email: "admin@bpbs.org" },
        update: {},
        create: {
            name: "BPBS Admin",
            email: "admin@bpbs.org",
            role: "ADMIN",
            status: "ACTIVE",
        },
    });

    console.log("✅ Seed complete!");
    console.log(`   Admin user: ${admin.email} (ID: ${admin.id})`);
    console.log("   Events: 3, Courses: 3, Kirtans: 5, Slides: 3");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
