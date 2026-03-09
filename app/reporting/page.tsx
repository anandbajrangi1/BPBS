"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        sleepTime: "",
        wakeUpTime: "",
        rounds: "",
        readingHours: "",
        hearingHours: "",
        remarks: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.rounds) {
            alert("Please enter the number of rounds at minimum.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/sadhna", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                alert("Thank you! Your Sadhna report has been sent securely.");
                setForm({ sleepTime: "", wakeUpTime: "", rounds: "", readingHours: "", hearingHours: "", remarks: "" });
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit report. Please try again.");
            }
        } catch (err) {
            alert("An error occurred. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container" style={{ background: "white" }}>
            {/* Header Area */}
            <div style={{
                background: "#FCE588", // Inspired by the mockup
                padding: "20px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        background: "#3A1B12", // dark brown arrow box
                        border: "none",
                        borderRadius: 8,
                        width: 44,
                        height: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0
                    }}
                >
                    <ArrowLeft size={24} color="white" />
                </button>
                <h1 style={{
                    fontFamily: "'Crimson Text', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#000",
                    margin: 0,
                }}>
                    Report Your Today's Sadhna
                </h1>
            </div>

            {/* Scrollable form view */}
            <div className="pb-nav" style={{ overflowY: "auto", padding: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 80 }}>

                    {[
                        { label: "Yesterday's Sleep", name: "sleepTime", type: "text", placeholder: "e.g., 10:00 PM" },
                        { label: "Wake Up Time", name: "wakeUpTime", type: "time", placeholder: "04:00 AM" },
                        { label: "No. Of Rounds", name: "rounds", type: "number", placeholder: "16" },
                        { label: "Reading (In Hours)", name: "readingHours", type: "number", placeholder: "1" },
                        { label: "Hearing (In Hours)", name: "hearingHours", type: "number", placeholder: "0.5" },
                        { label: "Remarks (Optional)", name: "remarks", type: "text", placeholder: "..." },
                    ].map((field) => (
                        <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#000",
                                paddingLeft: 8
                            }}>
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={(form as any)[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                style={{
                                    background: "#FFF4CC", // Off-yellow input color
                                    border: "none",
                                    borderRadius: 12,
                                    padding: "16px 16px",
                                    fontSize: 15,
                                    outline: "none",
                                    fontFamily: "'Nunito', sans-serif",
                                    color: "#333"
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed bottom Submit Button above nav */}
            <div style={{
                position: "fixed",
                bottom: 60, // Fixed directly above bottom nav
                left: 0,
                right: 0,
                padding: "16px 20px",
                background: "white",
                zIndex: 40,
                margin: "0 auto",
                maxWidth: 480
            }}>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    style={{
                        background: "#3A1B12", // match mockup submit button color
                        color: "white",
                        border: "none",
                        borderRadius: 12,
                        width: "100%",
                        padding: "18px 0",
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "'Nunito', sans-serif",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    {isLoading ? "Sending..." : "Send Report"}
                </button>
            </div>

            <BottomNav />
        </div>
    );
}
