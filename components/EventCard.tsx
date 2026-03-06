import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

interface Event {
    id: string;
    title: string;
    date: string;
    venue: string;
    location: string;
    description: string;
    category: string;
    rsvp: boolean;
    attendees: number;
}

const CATEGORY_COLORS: Record<string, string> = {
    Festival: "#FFB38E",
    Camp: "#FFDA6C",
    Class: "#c8f5c8",
};

export default function EventCard({ event }: { event: Event }) {
    const dateObj = new Date(event.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("en", { month: "short" }).toUpperCase();

    return (
        <div
            style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(75,43,31,0.08)",
                marginBottom: 16,
            }}
        >
            {/* Color banner */}
            <div
                style={{
                    background: `linear-gradient(135deg, ${CATEGORY_COLORS[event.category] || "#FFB38E"}, #FFDA6C)`,
                    height: 6,
                }}
            />

            <div style={{ padding: 16, display: "flex", gap: 14 }}>
                {/* Date block */}
                <div
                    style={{
                        minWidth: 52,
                        height: 60,
                        background: "#FFF8F0",
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #FFE0CC",
                    }}
                >
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#4B2B1F", lineHeight: 1 }}>{day}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#FFB38E", letterSpacing: 1 }}>{month}</span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#4B2B1F",
                                background: CATEGORY_COLORS[event.category] || "#FFB38E",
                                padding: "2px 8px",
                                borderRadius: 999,
                            }}
                        >
                            {event.category.toUpperCase()}
                        </span>
                    </div>
                    <h3
                        style={{
                            fontFamily: "'Crimson Text', serif",
                            fontSize: 17,
                            fontWeight: 600,
                            color: "#2D1B10",
                            marginBottom: 6,
                            lineHeight: 1.3,
                        }}
                    >
                        {event.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                        <MapPin size={12} color="#FFB38E" />
                        <span style={{ fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {event.location}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Users size={12} color="#FFB38E" />
                        <span style={{ fontSize: 12, color: "#888" }}>{event.attendees} attending</span>
                    </div>
                </div>
            </div>

            <p
                style={{
                    padding: "0 16px",
                    fontSize: 13,
                    color: "#666",
                    lineHeight: 1.5,
                    marginBottom: 14,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {event.description}
            </p>

            <div style={{ padding: "0 16px 16px", display: "flex", gap: 10 }}>
                <Link
                    href={`/events/${event.id}`}
                    style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                        color: "#4B2B1F",
                        fontWeight: 700,
                        fontSize: 13,
                        border: "none",
                        borderRadius: 999,
                        padding: "10px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        textDecoration: "none",
                    }}
                >
                    View Details <ArrowRight size={14} />
                </Link>
                {event.rsvp && (
                    <button
                        style={{
                            background: "transparent",
                            color: "#4B2B1F",
                            fontWeight: 700,
                            fontSize: 13,
                            border: "2px solid #FFB38E",
                            borderRadius: 999,
                            padding: "10px 16px",
                            cursor: "pointer",
                        }}
                    >
                        RSVP
                    </button>
                )}
            </div>
        </div>
    );
}
