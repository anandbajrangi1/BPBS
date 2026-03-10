"use client";
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Heart } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
    kirtan: "#FFB38E",
    bhajan: "#FFDA6C",
    prayer: "#c8f5d8",
    stotra: "#E8A07A",
    mantra: "#F5C96B",
};

export default function KirtanPlayerClient({ kirtans }: { kirtans: any[] }) {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [liked, setLiked] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get the first featured kirtan or just the first kirtan for the Hero state
    const featuredKirtan = kirtans.find(k => k.featured) || kirtans[0];

    // Dynamic banner content based on whether something is playing
    const activeKirtan = kirtans.find(k => k.id === playingId) || featuredKirtan;

    const togglePlayback = (kirtan: any) => {
        if (!kirtan.url) return;

        if (playingId === kirtan.id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = kirtan.url;
                audioRef.current.play();
                setPlayingId(kirtan.id);

                // Fire and forget play count update
                fetch(`/api/public/kirtans/${kirtan.id}/play`, { method: "POST" }).catch(() => { });
            }
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            setPlayingId(null);
        };

        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, []);

    if (!mounted) return <div style={{ minHeight: "200px", background: "#4B2B1F" }} />;

    return (
        <>
            <audio ref={audioRef} style={{ display: "none" }} />

            {/* Featured / Active Banner */}
            <div
                style={{
                    background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                    padding: "24px 20px 0",
                    margin: "0",
                }}
            >
                <p style={{ color: "#FFDA6C", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
                    {playingId ? "🎵 NOW PLAYING" : "🌟 FEATURED RECORDING"}
                </p>
                <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>
                    {activeKirtan?.title || "No Title"}
                </h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
                    {activeKirtan?.artist || "Unknown Artist"} · {activeKirtan?.duration || "N/A"}
                </p>

                <div style={{ display: "flex", gap: 10, paddingBottom: 24 }}>
                    <button
                        disabled={!activeKirtan}
                        onClick={() => activeKirtan && togglePlayback(activeKirtan)}
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
                            cursor: activeKirtan?.url ? "pointer" : "not-allowed",
                            fontFamily: "'Nunito', sans-serif",
                            opacity: activeKirtan?.url ? 1 : 0.6
                        }}
                    >
                        {playingId === activeKirtan?.id ? <Pause size={16} /> : <Play size={16} />}
                        {playingId === activeKirtan?.id ? "Pause" : "Play Now"}
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
            </div>

            {/* List section */}
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
                                    border: playingId === kirtan.id ? "1.5px solid #FFB38E" : "1.5px solid transparent",
                                }}
                            >
                                {/* Play icon */}
                                <button
                                    onClick={() => togglePlayback(kirtan)}
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        background: playingId === kirtan.id
                                            ? "linear-gradient(135deg, #FFB38E, #FFDA6C)"
                                            : "#FFF3EC",
                                        border: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        cursor: kirtan.url ? "pointer" : "not-allowed",
                                        opacity: kirtan.url ? 1 : 0.5
                                    }}
                                >
                                    {playingId === kirtan.id
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
                                            background: TYPE_COLORS[kirtan.type.toLowerCase()] || "#FFB38E",
                                            padding: "2px 8px",
                                            borderRadius: 999,
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        {kirtan.type}
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
