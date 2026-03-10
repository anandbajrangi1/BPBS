const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const books = [
        {
            title: "Bhagavad Gita As It Is",
            author: "A.C. Bhaktivedanta Swami Prabhupada",
            description: "The Bhagavad-gita is widely considered as the summit of spiritual knowledge. It is a 700-verse Sanskrit scripture that is part of the Hindu epic Mahabharata.",
            category: "Scripture",
            readTime: "45 min",
            coverImage: "https://m.media-amazon.com/images/I/51-mYI-GAtL.jpg",
            content: "The Bhagavad-gita opens with the blind King Dhritarashtra requesting his secretary, Sanjaya, to narrate the events unfolding on the battlefield of Kurukshetra...",
            featured: true
        },
        {
            title: "The Science of Self-Realization",
            author: "A.C. Bhaktivedanta Swami Prabhupada",
            description: "A collection of articles, interviews, and lectures that describe the practices of bhakti-yoga in the modern age.",
            category: "Philosophy",
            readTime: "20 min",
            coverImage: "https://m.media-amazon.com/images/I/91eO29-K27L.jpg",
            content: "In this world, everyone is searching for happiness, but few know where it truly lies. Self-realization is the beginning of real happiness...",
            featured: true
        },
        {
            title: "The Nectar of Devotion",
            author: "A.C. Bhaktivedanta Swami Prabhupada",
            description: "A summary study of Bhakti-rasamrita-sindhu by Rupa Goswami, describing the complete science of devotional service.",
            category: "Philosophy",
            readTime: "30 min",
            coverImage: "https://m.media-amazon.com/images/I/71Gv0V-d8jL.jpg",
            pdfUrl: "https://vedabase.io/en/library/nod/",
            featured: false
        }
    ];

    for (const book of books) {
        await prisma.book.upsert({
            where: { id: "seed-" + book.title.replace(/\s+/g, '-').toLowerCase() },
            update: {},
            create: {
                ...book,
                id: "seed-" + book.title.replace(/\s+/g, '-').toLowerCase()
            }
        });
    }

    console.log("✅ Sample books seeded!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
