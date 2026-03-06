import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import EventCard from "@/components/EventCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' }
    });

    return (
        <div className="app-container">
            <Header title="Events" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                <div style={{ background: "linear-gradient(135deg, #4B2B1F, #7B452F)", padding: "20px 20px 24px" }}>
                    <p style={{ color: "rgba(255,230,200,0.7)", fontSize: 13, marginBottom: 4 }}>📅 {events.length} upcoming events</p>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "white" }}>
                        Spiritual Gatherings
                    </h2>
                </div>
                <div style={{ padding: "16px 16px" }}>
                    {events.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#888", marginTop: 40 }}>No upcoming events.</p>
                    ) : (
                        events.map((event) => (
                            <EventCard key={event.id} event={event as any} />
                        ))
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
