"use client";
import { useState } from "react";
import { Play, Pause, Download, Heart } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
    kirtan: "#FFB38E",
    bhajan: "#FFDA6C",
    prayer: "#c8f5d8",
};

export default function KirtanPlayerClient({ kirtans }: { kirtans: any[] }) {
    const [playing, setPlaying] = useState<string | null>(null);
    const [liked, setLiked] = useState<Set<string>>(new Set());

    return (
        <>
            <div style={{ display: "flex", gap: 10, padding: "0 20px 24px", background: "linear-gradient(135deg, #4B2B1F, #7B452F)" }}>
                <button
                    onClick={() => setPlaying(playing === "1" ? null : "1")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                        border: "none",
                        borderRadius: 999,
                        padding: "10px 20px",
                        fontWeight: 700,
                        color: "#4B2B1F",
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                    }}
                >
                    {playing === "1" ? <Pause size={16} /> : <Play size={16} />}
                    {playing === "1" ? "Pause" : "Play Now"}
                </button>
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 999,
                        padding: "10px 16px",
                        color: "white",
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                    }}
                >
                    <Download size={14} /> Save
                </button>
            </div>

            {/* Category filter */}
            <div style={{ padding: "16px 16px 8px" }}>
                <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", marginBottom: 14 }}>
                    All Recordings
                </h3>

                {/* Playlist */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {kirtans.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#888", marginTop: 40 }}>No audio recordings available yet.</p>
                    ) : (
                        kirtans.map((kirtan) => (
                            <div
                                key={kirtan.id}
                                style={{
                                    background: "white",
                                    borderRadius: 14,
                                    padding: "14px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    boxShadow: "0 2px 12px rgba(75,43,31,0.06)",
                                    border: playing === kirtan.id ? "1.5px solid #FFB38E" : "1.5px solid transparent",
                                }}
                            >
                                {/* Play icon */}
                                <button
                                    onClick={() => setPlaying(playing === kirtan.id ? null : kirtan.id)}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        background: playing === kirtan.id
                                            ? "linear-gradient(135deg, #FFB38E, #FFDA6C)"
                                            : "#FFF3EC",
                                        border: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        cursor: "pointer",
                                    }}
                                >
                                    {playing === kirtan.id
                                        ? <Pause size={18} color="#4B2B1F" />
                                        : <Play size={18} color="#FFB38E" />
                                    }
                                </button>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {kirtan.title}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#999" }}>{kirtan.artist} · {kirtan.duration}</div>
                                </div>

                                {/* Type badge + like */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                                    <span
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: "#4B2B1F",
                                            background: TYPE_COLORS[kirtan.type] || "#FFB38E",
                                            padding: "2px 8px",
                                            borderRadius: 999,
                                        }}
                                    >
                                        {kirtan.type.toUpperCase()}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const newLiked = new Set(liked);
                                            liked.has(kirtan.id) ? newLiked.delete(kirtan.id) : newLiked.add(kirtan.id);
                                            setLiked(newLiked);
                                        }}
                                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                                    >
                                        <Heart
                                            size={16}
                                            fill={liked.has(kirtan.id) ? "#FFB38E" : "none"}
                                            color={liked.has(kirtan.id) ? "#FFB38E" : "#ccc"}
                                        />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
