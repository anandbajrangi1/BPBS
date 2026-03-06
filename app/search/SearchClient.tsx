"use client";
import { useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Search } from "lucide-react";
import Link from "next/link";

type ResultItem = { id: string; title: string; type: string; sub: string; url: string };

export default function SearchClient({
    searchData
}: {
    searchData: {
        kirtans: any[];
        courses: any[];
        events: any[];
        seva: any[];
    }
}) {
    const [query, setQuery] = useState("");

    const results: ResultItem[] = query.trim().length < 2
        ? []
        : [
            ...searchData.kirtans.filter((k) => k.title.toLowerCase().includes(query.toLowerCase())).map((k) => ({ id: k.id, title: k.title, type: "Kirtan", sub: k.artist, url: `/kirtan` })),
            ...searchData.courses.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())).map((c) => ({ id: c.id, title: c.title, type: "Course", sub: c.instructor, url: `/courses/${c.id}` })),
            ...searchData.events.filter((e) => e.title.toLowerCase().includes(query.toLowerCase())).map((e) => ({ id: e.id, title: e.title, type: "Event", sub: e.location, url: `/events/${e.id}` })),
            ...searchData.seva.filter((s) => s.title.toLowerCase().includes(query.toLowerCase())).map((s) => ({ id: s.id, title: s.title, type: "Seva", sub: s.location, url: `/seva` })),
        ];

    const TYPE_EMOJI: Record<string, string> = { Kirtan: "🎵", Course: "📚", Event: "📅", Seva: "❤️" };
    const TYPE_COLOR: Record<string, string> = { Kirtan: "#FFB38E", Course: "#FFDA6C", Event: "#c8f5c8", Seva: "#FFE0CC" };

    return (
        <div className="app-container">
            <Header title="Search" showBack={true} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                <div style={{ padding: "16px" }}>
                    <div
                        style={{
                            background: "white",
                            border: "1.5px solid #FFE0CC",
                            borderRadius: 14,
                            padding: "10px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            boxShadow: "0 2px 12px rgba(75,43,31,0.06)",
                        }}
                    >
                        <Search size={18} color="#FFB38E" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search kirtans, courses, events, seva…"
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                fontSize: 15,
                                color: "#2D1B10",
                                fontFamily: "'Nunito', sans-serif",
                                background: "transparent",
                            }}
                        />
                    </div>

                    {/* Quick links */}
                    {!query && (
                        <div style={{ marginTop: 20 }}>
                            <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", marginBottom: 12 }}>
                                Browse by Category
                            </h3>
                            {[
                                { label: "Kirtans & Bhajans", emoji: "🎵", color: "#FFB38E", href: "/kirtan" },
                                { label: "Courses", emoji: "📚", color: "#FFDA6C", href: "/courses" },
                                { label: "Events", emoji: "📅", color: "#c8f5c8", href: "/events" },
                                { label: "Volunteer Seva", emoji: "❤️", color: "#FFE0CC", href: "/seva" },
                                { label: "Japa Chanting", emoji: "📿", color: "#FFF3EC", href: "/japa" },
                            ].map((cat) => (
                                <Link key={cat.label} href={cat.href} style={{ textDecoration: "none" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 14,
                                            background: "white",
                                            borderRadius: 14,
                                            padding: "14px 16px",
                                            marginBottom: 10,
                                            boxShadow: "0 2px 10px rgba(75,43,31,0.05)",
                                        }}
                                    >
                                        <span style={{ fontSize: 22, width: 36, height: 36, background: cat.color, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {cat.emoji}
                                        </span>
                                        <span style={{ fontSize: 15, fontWeight: 700, color: "#2D1B10" }}>{cat.label}</span>
                                        <span style={{ marginLeft: "auto", color: "#ccc", fontSize: 20 }}>›</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Results */}
                    {query.trim().length >= 2 && (
                        <div style={{ marginTop: 16 }}>
                            <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 17, fontWeight: 600, color: "#2D1B10", marginBottom: 12 }}>
                                {results.length > 0 ? `${results.length} results` : "No results found"}
                            </h3>
                            {results.map((r) => (
                                <Link
                                    key={r.id + r.type}
                                    href={r.url}
                                    style={{
                                        textDecoration: "none",
                                        background: "white",
                                        borderRadius: 14,
                                        padding: "14px 16px",
                                        marginBottom: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        boxShadow: "0 2px 10px rgba(75,43,31,0.05)",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 36,
                                            height: 36,
                                            background: TYPE_COLOR[r.type],
                                            borderRadius: 10,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 18,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {TYPE_EMOJI[r.type]}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{r.title}</div>
                                        <div style={{ fontSize: 12, color: "#999" }}>{r.type} · {r.sub}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
