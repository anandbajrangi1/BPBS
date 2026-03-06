import { prisma } from "@/lib/prisma";
import SearchClient from "./SearchClient";

export default async function SearchPage() {
    // Fetch all searchable data from database
    const [kirtans, courses, events] = await Promise.all([
        prisma.kirtan.findMany({ select: { id: true, title: true, artist: true } }),
        prisma.course.findMany({ select: { id: true, title: true, instructor: true } }),
        prisma.event.findMany({
            where: { date: { gte: new Date() } },
            select: { id: true, title: true, location: true }
        }),
    ]);

    return (
        <SearchClient
            searchData={{
                kirtans,
                courses,
                events,
            }}
        />
    );
}
