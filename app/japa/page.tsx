"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const MANTRA = "हरे कृष्ण हरे कृष्ण\nकृष्ण कृष्ण हरे हरे\nहरे राम हरे राम\nराम राम हरे हरे";

export default function JapaPage() {
    const [isActive, setIsActive] = useState(false);
    const [count, setCount] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [speed, setSpeed] = useState(50);
    const [seconds, setSeconds] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleSaveSession = async () => {
        if (rounds === 0 && count === 0) return;
        setIsSaving(true);
        try {
            const totalRounds = rounds + (count / 108);
            const res = await fetch("/api/japa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rounds: parseFloat(totalRounds.toFixed(2)),
                    duration: seconds
                }),
            });
            if (res.ok) {
                alert("Session saved successfully! Hare Krishna!");
                setIsActive(false);
                setCount(0);
                setSeconds(0);
                setRounds(0);
            } else {
                alert("Failed to save session. Please try again.");
            }
        } catch (error) {
            console.error("Error saving japa session:", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setSeconds((s) => s + 1);
                const beadsPerSecond = speed / 30;
                setCount((c) => {
                    const newCount = c + beadsPerSecond;
                    if (newCount >= 108) {
                        setRounds((r) => r + 1);
                        return newCount - 108;
                    }
                    return newCount;
                });
            }, 1000);
        } else {
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
    }, [isActive, speed]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const bead = Math.floor(count);
    const progress = (bead / 108) * 100;

    return (
        <div className="app-container">
            <Header title="Japa — Chant & Be Happy" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>

                {/* Mantra display */}
                <div
                    style={{
                        background: "linear-gradient(160deg, #4B2B1F 0%, #7B452F 100%)",
                        padding: "28px 24px",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Decorative circles */}
                    <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,218,108,0.08)" }} />
                    <div style={{ position: "absolute", bottom: -20, left: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,179,142,0.1)" }} />

                    <p style={{ color: "#FFDA6C", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>
                        🕉️ HARE KRISHNA MAHAMANTRA
                    </p>
                    <div
                        style={{
                            fontFamily: "'Crimson Text', serif",
                            fontSize: 28,
                            fontWeight: 600,
                            color: "white",
                            lineHeight: 1.7,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {MANTRA}
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "#FFE0CC" }}>
                    {[
                        { label: "Rounds", value: rounds },
                        { label: "Beads", value: `${bead}/108` },
                        { label: "Time", value: formatTime(seconds) },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            style={{
                                background: "white",
                                padding: "16px 12px",
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "#4B2B1F" }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div style={{ padding: "16px 24px", background: "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#4B2B1F" }}>Current Round Progress</span>
                        <span style={{ fontSize: 12, color: "#FFB38E", fontWeight: 700 }}>{bead}/108</span>
                    </div>
                    <div style={{ height: 8, background: "#f0e8e0", borderRadius: 4, overflow: "hidden" }}>
                        <div
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #FFB38E, #FFDA6C)",
                                borderRadius: 4,
                                transition: "width 0.5s ease",
                            }}
                        />
                    </div>
                </div>

                {/* Main chanting button */}
                <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, background: "#FEFAF6" }}>
                    <div
                        onClick={() => setIsActive((a) => !a)}
                        style={{
                            width: 140,
                            height: 140,
                            borderRadius: "50%",
                            background: isActive
                                ? "linear-gradient(135deg, #4B2B1F, #7B452F)"
                                : "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            boxShadow: isActive
                                ? "0 8px 40px rgba(75,43,31,0.4)"
                                : "0 8px 40px rgba(255,179,142,0.5)",
                            transition: "all 0.3s ease",
                            position: "relative",
                        }}
                    >
                        {isActive && (
                            <>
                                <div
                                    className="pulse-ring"
                                    style={{
                                        position: "absolute",
                                        width: 140,
                                        height: 140,
                                        borderRadius: "50%",
                                        border: "3px solid rgba(75,43,31,0.3)",
                                    }}
                                />
                                <div
                                    className="pulse-ring"
                                    style={{
                                        position: "absolute",
                                        width: 140,
                                        height: 140,
                                        borderRadius: "50%",
                                        border: "3px solid rgba(75,43,31,0.2)",
                                        animationDelay: "0.5s",
                                    }}
                                />
                            </>
                        )}
                        <span style={{ fontSize: 40 }}>{isActive ? "⏸️" : "📿"}</span>
                        <span
                            style={{
                                fontFamily: "'Crimson Text', serif",
                                fontSize: 16,
                                fontWeight: 700,
                                color: isActive ? "white" : "#4B2B1F",
                                marginTop: 4,
                            }}
                        >
                            {isActive ? "Pause" : "Start Japa"}
                        </span>
                    </div>

                    {/* Speed control */}
                    <div style={{ width: "100%", maxWidth: 320 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#4B2B1F" }}>Chanting Speed</span>
                            <span style={{ fontSize: 13, color: "#FFB38E", fontWeight: 700 }}>
                                {speed < 33 ? "🐢 Slow" : speed < 66 ? "🎵 Medium" : "⚡ Fast"}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={10}
                            max={100}
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            style={{
                                width: "100%",
                                accentColor: "#FFB38E",
                                height: 6,
                            }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                            <span style={{ fontSize: 11, color: "#bbb" }}>Slow</span>
                            <span style={{ fontSize: 11, color: "#bbb" }}>Fast</span>
                        </div>
                    </div>

                    {/* Reset & Save */}
                    <div style={{ display: "flex", gap: 12, width: "100%", justifyContent: "center" }}>
                        <button
                            onClick={() => { setIsActive(false); setCount(0); setSeconds(0); setRounds(0); }}
                            style={{
                                background: "transparent",
                                border: "1.5px solid #FFB38E",
                                borderRadius: 999,
                                padding: "10px 24px",
                                color: "#4B2B1F",
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: "pointer",
                                fontFamily: "'Nunito', sans-serif",
                            }}
                        >
                            Reset
                        </button>

                        {(rounds > 0 || count > 0) && (
                            <button
                                onClick={handleSaveSession}
                                disabled={isSaving}
                                style={{
                                    background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                    border: "none",
                                    borderRadius: 999,
                                    padding: "10px 24px",
                                    color: "#4B2B1F",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    cursor: isSaving ? "not-allowed" : "pointer",
                                    fontFamily: "'Nunito', sans-serif",
                                    opacity: isSaving ? 0.7 : 1,
                                }}
                            >
                                {isSaving ? "Saving..." : "Save Session"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
