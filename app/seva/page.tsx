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

    const [joiningId, setJoiningId] = useState<string | null>(null);

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

    const handleJoin = async (sevaId: string) => {
        setJoiningId(sevaId);
        try {
            const res = await fetch(`/api/seva/${sevaId}/join`, {
                method: "POST",
            });
            if (res.ok) {
                alert("Thank you for volunteering! The admin will contact you soon.");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to join seva. Please try again.");
            }
        } catch (err) {
            alert("Error joining seva.");
        } finally {
            setJoiningId(null);
        }
    };

    return (
        <div className="app-container">
            <Header title="Seva Opportunities" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "30px 20px",
                        textAlign: "center"
                    }}
                >
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 26, fontWeight: 700, color: "white", marginBottom: 12 }}>
                        Offer Your Service
                    </h2>
                    <p style={{ color: "rgba(255,230,200,0.8)", fontSize: 13, marginBottom: 24, padding: "0 10px" }}>
                        "The highest perfection of human life is to serve."<br />Choose how you would like to contribute.
                    </p>

                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        <a href="#volunteer-section" style={{ flex: 1, textDecoration: "none" }}>
                            <div style={{
                                background: "rgba(255,255,255,0.1)",
                                border: "1.5px solid rgba(255,255,255,0.2)",
                                borderRadius: 16,
                                padding: "16px",
                                backdropFilter: "blur(10px)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8
                            }}>
                                <span style={{ fontSize: 28 }}>🙏</span>
                                <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>Volunteer</span>
                            </div>
                        </a>
                        <a href="/donate" style={{ flex: 1, textDecoration: "none" }}>
                            <div style={{
                                background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                borderRadius: 16,
                                padding: "16px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                            }}>
                                <span style={{ fontSize: 28 }}>🪔</span>
                                <span style={{ color: "#4B2B1F", fontSize: 14, fontWeight: 800 }}>Donate</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div id="volunteer-section" style={{ padding: "24px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10" }}>
                            🙋 Physical Seva
                        </h2>
                    </div>
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
                                flexDirection: "column",
                                gap: 14,
                                boxShadow: "0 4px 16px rgba(75,43,31,0.07)",
                            }}
                        >
                            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
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
                            </div>
                            <div style={{ borderTop: "1px dashed #f0e8e0", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>Earn spiritual merits!</span>
                                <button
                                    onClick={() => handleJoin(seva.id)}
                                    disabled={joiningId === seva.id}
                                    style={{
                                        background: joiningId === seva.id ? "#ccc" : "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                        border: "none",
                                        borderRadius: 10,
                                        padding: "10px 20px",
                                        color: "#4B2B1F",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        cursor: joiningId === seva.id ? "default" : "pointer",
                                        fontFamily: "'Nunito', sans-serif",
                                        opacity: joiningId === seva.id ? 0.7 : 1,
                                    }}
                                >
                                    {joiningId === seva.id ? "Joining..." : "Join Seva"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
