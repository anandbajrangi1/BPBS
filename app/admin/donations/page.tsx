"use client";
import { useState, useEffect } from "react";

export default function AdminDonationsPage() {
    const [donations, setDonations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const res = await fetch("/api/donations?admin=true");
            if (res.ok) setDonations(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const total = donations.reduce((a, b) => a + (b.amount / 100), 0);
    const byPurpose = donations.reduce((acc: Record<string, number>, d) => {
        acc[d.purpose] = (acc[d.purpose] || 0) + (d.amount / 100);
        return acc;
    }, {});

    return (
        <div>
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>Donation Management</h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{donations.length} donations received</p>
                </div>
                <button
                    style={{
                        background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                        border: "none",
                        borderRadius: 12,
                        padding: "11px 20px",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#4B2B1F",
                        cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                    }}
                >
                    📤 Export CSV
                </button>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {/* Summary cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
                    {[
                        { label: "Total Collected", value: `₹${total.toLocaleString()}`, emoji: "💰", color: "#FFB38E" },
                        { label: "This Month", value: `₹${total.toLocaleString()}`, emoji: "📅", color: "#FFDA6C" },
                        { label: "Transactions", value: donations.length, emoji: "🧾", color: "#c8f5c8" },
                    ].map((s) => (
                        <div
                            key={s.label}
                            style={{
                                background: "white",
                                borderRadius: 16,
                                padding: "20px",
                                boxShadow: "0 2px 16px rgba(75,43,31,0.07)",
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                            }}
                        >
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                                {s.emoji}
                            </div>
                            <div>
                                <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 26, fontWeight: 700, color: "#2D1B10" }}>{s.value}</div>
                                <div style={{ fontSize: 12, color: "#999", fontWeight: 600 }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Purpose breakdown */}
                <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 16px rgba(75,43,31,0.07)", marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>
                        Breakdown by Purpose
                    </h2>
                    {Object.entries(byPurpose).map(([purpose, amount]) => (
                        <div key={purpose} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#4B2B1F" }}>{purpose}</span>
                                <span style={{ fontSize: 13, color: "#FFB38E", fontWeight: 700 }}>₹{amount.toLocaleString()}</span>
                            </div>
                            <div style={{ height: 8, background: "#f0e8e0", borderRadius: 4, overflow: "hidden" }}>
                                <div style={{ width: `${(amount / total) * 100}%`, height: "100%", background: "linear-gradient(90deg, #FFB38E, #FFDA6C)", borderRadius: 4 }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Transactions table */}
                <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#FFF8F0" }}>
                                {["#", "Donor", "Amount", "Purpose", "Method", "Date"].map((h) => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>
                                        {h.toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                        Loading donations...
                                    </td>
                                </tr>
                            ) : donations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                        No donations found.
                                    </td>
                                </tr>
                            ) : donations.map((d, i) => (
                                <tr key={d.id} style={{ borderTop: "1px solid #f7f0ea", background: i % 2 === 0 ? "white" : "#FEFAF6" }}>
                                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#aaa", fontWeight: 700 }}>#{d.id.substring(0, 8)}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{d.donorName || d.user?.name || "Anonymous"}</td>
                                    <td style={{ padding: "12px 16px", fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 700, color: "#FFB38E" }}>₹{(d.amount / 100).toLocaleString()}</td>
                                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#666" }}>{d.purpose}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, background: d.status === "SUCCESS" ? "#c8f5c8" : "#FFDA6C", color: d.status === "SUCCESS" ? "#2a7a2a" : "#4B2B1F", padding: "3px 8px", borderRadius: 999 }}>
                                            {d.status || "SUCCESS"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#999" }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
