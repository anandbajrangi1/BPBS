"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

type Seva = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    emoji: string;
    color: string;
};

export default function SevaPage() {
    const [sevas, setSevas] = useState<Seva[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/seva")
            .then(res => res.json())
            .then(data => {
                setSevas(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="app-container">
            <Header title="Volunteer Seva" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "24px 20px",
                    }}
                >
                    <p style={{ color: "#FFDA6C", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
                        ❤️ SERVE & GROW
                    </p>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "white", marginBottom: 6 }}>
                        Offer Your Service
                    </h2>
                    <p style={{ color: "rgba(255,230,200,0.75)", fontSize: 13 }}>
                        "The highest perfection of human life is to serve." — Srimad Bhagavatam
                    </p>
                </div>

                <div style={{ padding: "20px 16px" }}>
                    {isLoading ? (
                        <p style={{ textAlign: "center", color: "#888", padding: 40 }}>Loading opportunities...</p>
                    ) : sevas.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#888", padding: 40 }}>No seva opportunities currently available.</p>
                    ) : sevas.map((seva) => (
                        <div
                            key={seva.id}
                            style={{
                                background: "white",
                                borderRadius: 16,
                                padding: "16px",
                                marginBottom: 14,
                                display: "flex",
                                gap: 14,
                                alignItems: "flex-start",
                                boxShadow: "0 4px 16px rgba(75,43,31,0.07)",
                            }}
                        >
                            <div
                                style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 14,
                                    background: seva.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 26,
                                    flexShrink: 0,
                                }}
                            >
                                {seva.emoji}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 17, fontWeight: 600, color: "#2D1B10", marginBottom: 4 }}>
                                    {seva.title}
                                </h3>
                                <p style={{ fontSize: 13, color: "#888", marginBottom: 8, lineHeight: 1.4 }}>{seva.description}</p>
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#4B2B1F" }}>📅 {seva.date}</span>
                                    <span style={{ fontSize: 11, color: "#999" }}>📍 {seva.location}</span>
                                </div>
                            </div>
                            <button
                                style={{
                                    background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                    border: "none",
                                    borderRadius: 10,
                                    padding: "8px 14px",
                                    color: "#4B2B1F",
                                    fontWeight: 700,
                                    fontSize: 12,
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    fontFamily: "'Nunito', sans-serif",
                                }}
                            >
                                Join
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
