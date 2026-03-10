"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { CheckCircle2, History } from "lucide-react";

export default function ReportingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    const [form, setForm] = useState({
        sleepTime: "",
        wakeUpTime: "",
        rounds: "",
        readingHours: "",
        hearingHours: "",
        remarks: "",
    });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/sadhna");
            if (res.ok) {
                const data = await res.json();
                setHistory(data.slice(0, 5));
            }
        } catch (err) {
            console.error("Failed to fetch history");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.rounds) {
            setStatus({ type: 'error', msg: "Please enter the number of rounds." });
            return;
        }

        setIsLoading(true);
        setStatus(null);
        try {
            const res = await fetch("/api/sadhna", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setStatus({ type: 'success', msg: "Sadhna report sent successfully!" });
                setForm({ sleepTime: "", wakeUpTime: "", rounds: "", readingHours: "", hearingHours: "", remarks: "" });
                fetchHistory();
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus({ type: 'error', msg: "Failed to submit report." });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: "Connection error." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <Header title="Daily Sadhna" showBack={false} />

            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Hero section to match home */}
                <div style={{
                    background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                    padding: "24px 20px",
                    color: "white"
                }}>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                        Report Your Seva
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                        Document your spiritual progress for today.
                    </p>
                </div>

                <div style={{ padding: "20px" }}>
                    <form onSubmit={handleSubmit} style={{
                        background: "white",
                        borderRadius: 20,
                        padding: 20,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        marginBottom: 24
                    }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { label: "Yesterday's Sleep", name: "sleepTime", type: "text", placeholder: "e.g., 10:00 PM" },
                                { label: "Wake Up Time", name: "wakeUpTime", type: "time", placeholder: "04:00 AM" },
                                { label: "No. Of Rounds", name: "rounds", type: "number", placeholder: "16" },
                                { label: "Reading (Hours)", name: "readingHours", type: "number", placeholder: "1" },
                                { label: "Hearing (Hours)", name: "hearingHours", type: "number", placeholder: "0.5" },
                                { label: "Remarks (Optional)", name: "remarks", type: "text", placeholder: "..." },
                            ].map((field) => (
                                <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>
                                        {field.label.toUpperCase()}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={(form as any)[field.name]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        style={{
                                            background: "#FEFAF6",
                                            border: "1.5px solid #FFE0CC",
                                            borderRadius: 12,
                                            padding: "12px 14px",
                                            fontSize: 14,
                                            outline: "none",
                                            fontFamily: "'Nunito', sans-serif"
                                        }}
                                    />
                                </div>
                            ))}

                            {status && (
                                <div style={{
                                    padding: "12px",
                                    borderRadius: 10,
                                    background: status.type === 'success' ? "#ECFDF5" : "#FEF2F2",
                                    color: status.type === 'success' ? "#059669" : "#DC2626",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                }}>
                                    {status.type === 'success' && <CheckCircle2 size={16} />}
                                    {status.msg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                    color: "#4B2B1F",
                                    border: "none",
                                    borderRadius: 12,
                                    width: "100%",
                                    padding: "14px 0",
                                    fontSize: 15,
                                    fontWeight: 700,
                                    marginTop: 8,
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    opacity: isLoading ? 0.7 : 1,
                                    boxShadow: "0 4px 12px rgba(255,179,142,0.3)"
                                }}
                            >
                                {isLoading ? "Submitting..." : "Send Report"}
                            </button>
                        </div>
                    </form>

                    {/* History Section */}
                    {history.length > 0 && (
                        <div style={{ paddingBottom: 40 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <History size={20} color="#4B2B1F" />
                                <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 19, fontWeight: 700, color: "#2D1B10" }}>
                                    Recent Reports
                                </h3>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {history.map((report) => (
                                    <div key={report.id} style={{
                                        background: "white",
                                        borderRadius: 16,
                                        padding: "14px 16px",
                                        border: "1px solid #FFE0CC",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: "#2D1B10" }}>
                                                {new Date(report.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div style={{ fontSize: 11, color: "#999" }}>
                                                Sleep: {report.sleepTime || 'N/A'} · Wake: {report.wakeUpTime || 'N/A'}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: "#FFF3EC",
                                            padding: "6px 12px",
                                            borderRadius: 10,
                                            textAlign: "center"
                                        }}>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: "#4B2B1F" }}>{report.rounds}</div>
                                            <div style={{ fontSize: 9, color: "#FFB38E", fontWeight: 700, textTransform: "uppercase" }}>Rounds</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
