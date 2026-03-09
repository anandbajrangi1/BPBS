import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RSVPButton from "@/components/RSVPButton";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
        notFound();
    }

    const dateObj = new Date(event.date);

    return (
        <div className="app-container">
            <Header title="Event Details" />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Hero banner */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #FFB38E 0%, #FFDA6C 100%)",
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 80,
                        position: "relative",
                    }}
                >
                    {event.category === "Festival" ? "🪔" : event.category === "Camp" ? "⛺" : "📿"}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 40,
                            background: "white",
                            borderRadius: "20px 20px 0 0",
                        }}
                    />
                </div>

                <div style={{ padding: "0 16px 24px" }}>
                    {/* Category + title */}
                    <span
                        style={{
                            display: "inline-block",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#4B2B1F",
                            background: "#FFB38E",
                            padding: "3px 10px",
                            borderRadius: 999,
                            marginBottom: 8,
                            letterSpacing: 1,
                        }}
                    >
                        {event.category.toUpperCase()}
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Crimson Text', serif",
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#2D1B10",
                            marginBottom: 16,
                            lineHeight: 1.2,
                        }}
                    >
                        {event.title}
                    </h1>

                    {/* Details */}
                    {[
                        { icon: Calendar, text: dateObj.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                        { icon: MapPin, text: `${event.venue}, ${event.location}` },
                        // { icon: Users, text: `${event.attendees} devotees attending` }, // Moved to RSVPButton
                        { icon: Clock, text: "9:00 AM – 8:00 PM" },
                    ].map(({ icon: Icon, text }) => (
                        <div
                            key={text}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                                marginBottom: 12,
                                padding: "12px 14px",
                                background: "#FFF8F0",
                                borderRadius: 12,
                            }}
                        >
                            <Icon size={18} color="#FFB38E" style={{ flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 14, color: "#4B2B1F", fontWeight: 600, lineHeight: 1.4 }}>{text}</span>
                        </div>
                    ))}

                    {/* RSVP Section */}
                    {event.rsvp && (
                        <RSVPButton eventId={event.id} />
                    )}

                    {/* Description */}
                    <div style={{ marginTop: 20, marginBottom: 24 }}>
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 10 }}>
                            About this Event
                        </h2>
                        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7 }}>
                            {event.description}
                        </p>
                        <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginTop: 10 }}>
                            Join us for this beautiful spiritual gathering. All devotees, well-wishers, and curious truth-seekers are warmly welcome. Prasad (sanctified food) will be served to all attendees.
                        </p>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
