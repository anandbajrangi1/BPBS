"use client";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const weekly = [
    { day: "Mon", rounds: 12 },
    { day: "Tue", rounds: 16 },
    { day: "Wed", rounds: 10 },
    { day: "Thu", rounds: 16 },
    { day: "Fri", rounds: 14 },
    { day: "Sat", rounds: 16 },
    { day: "Sun", rounds: 4 },
];

const monthly = [
    { week: "W1", rounds: 98 },
    { week: "W2", rounds: 112 },
    { week: "W3", rounds: 88 },
    { week: "W4", rounds: 105 },
];

export default function ReportingPage() {
    const totalThisWeek = weekly.reduce((a, b) => a + b.rounds, 0);

    return (
        <div className="app-container">
            <Header title="My Sadhana Report" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>

                {/* Summary stats */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "20px 20px 28px",
                    }}
                >
                    <p style={{ color: "#FFDA6C", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
                        📊 YOUR PROGRESS
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {[
                            { label: "Total Rounds (All Time)", value: "1,840", emoji: "📿" },
                            { label: "This Week", value: totalThisWeek, emoji: "📅" },
                            { label: "Daily Average", value: (totalThisWeek / 7).toFixed(1), emoji: "📈" },
                            { label: "Days Active", value: "186", emoji: "🔥" },
                        ].map((s) => (
                            <div
                                key={s.label}
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    borderRadius: 14,
                                    padding: "14px 12px",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
                                <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "white" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: 11, color: "rgba(255,230,200,0.7)" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly chart */}
                <div style={{ padding: "20px 16px 0" }}>
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: 16,
                            boxShadow: "0 4px 20px rgba(75,43,31,0.08)",
                            marginBottom: 16,
                        }}
                    >
                        <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>
                            📅 This Week
                        </h3>
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={weekly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#999" }} />
                                <YAxis tick={{ fontSize: 11, fill: "#999" }} />
                                <Tooltip
                                    formatter={(val) => [`${val} rounds`, "Japa"]}
                                    contentStyle={{ borderRadius: 10, border: "1px solid #FFE0CC", fontSize: 12 }}
                                />
                                <Bar dataKey="rounds" fill="#FFB38E" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly trend */}
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: 16,
                            boxShadow: "0 4px 20px rgba(75,43,31,0.08)",
                            marginBottom: 16,
                        }}
                    >
                        <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>
                            📈 Monthly Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={140}>
                            <LineChart data={monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
                                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#999" }} />
                                <YAxis tick={{ fontSize: 11, fill: "#999" }} />
                                <Tooltip
                                    formatter={(val) => [`${val} rounds`, "Japa"]}
                                    contentStyle={{ borderRadius: 10, border: "1px solid #FFE0CC", fontSize: 12 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rounds"
                                    stroke="#FFB38E"
                                    strokeWidth={3}
                                    dot={{ fill: "#FFB38E", r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Progress towards monthly goal */}
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: 18,
                            boxShadow: "0 4px 20px rgba(75,43,31,0.08)",
                            marginBottom: 16,
                        }}
                    >
                        <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", marginBottom: 14 }}>
                            🎯 Monthly Goal
                        </h3>
                        {[
                            { label: "Japa Rounds", done: 403, goal: 480, color: "#FFB38E" },
                            { label: "Chanting Hours", done: 34, goal: 40, color: "#FFDA6C" },
                            { label: "Days Active", done: 24, goal: 30, color: "#c8f5c8" },
                        ].map((g) => (
                            <div key={g.label} style={{ marginBottom: 14 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#4B2B1F" }}>{g.label}</span>
                                    <span style={{ fontSize: 13, color: "#999" }}>{g.done}/{g.goal}</span>
                                </div>
                                <div style={{ height: 8, background: "#f0e8e0", borderRadius: 4, overflow: "hidden" }}>
                                    <div
                                        style={{
                                            width: `${(g.done / g.goal) * 100}%`,
                                            height: "100%",
                                            background: g.color,
                                            borderRadius: 4,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
