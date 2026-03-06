"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";

type Step = "phone" | "otp";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = async () => {
        if (!phone.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep("otp");
                if (data.message) console.log(data.message); // shows OTP in dev mode
            } else {
                setError(data.error || "Failed to send OTP");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) return;
        setLoading(true);
        setError("");
        try {
            const result = await signIn("credentials", {
                phone: phone.trim(),
                otp: otp.trim(),
                redirect: false,
            });
            if (result?.ok) {
                router.push("/");
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = () =>
        signIn("google", { callbackUrl: "/" });

    return (
        <div
            style={{
                minHeight: "100dvh",
                background: "linear-gradient(160deg, #4B2B1F 0%, #7B452F 45%, #FFB38E 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,218,108,0.1)" }} />
            <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,179,142,0.1)" }} />

            <div style={{ fontSize: 60, marginBottom: 12 }}>🕉️</div>
            <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 30, fontWeight: 700, color: "white", marginBottom: 4 }}>
                {step === "phone" ? "Hare Krishna!" : "Enter OTP"}
            </h1>
            <p style={{ color: "rgba(255,230,200,0.7)", marginBottom: 32, fontSize: 14, textAlign: "center" }}>
                {step === "phone"
                    ? "Login to your spiritual journey"
                    : `OTP sent to ${phone}`}
            </p>

            <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", position: "relative", zIndex: 1 }}>

                {error && (
                    <div style={{ background: "#fee2e2", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
                        {error}
                    </div>
                )}

                {step === "phone" ? (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>PHONE NUMBER</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <Phone size={16} color="#FFB38E" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                                    placeholder="+91 98765 43210"
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", fontFamily: "'Nunito', sans-serif" }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSendOtp}
                            disabled={loading || !phone.trim()}
                            className="btn-primary"
                            style={{ width: "100%", padding: 14, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? "Sending…" : <>Send OTP <ArrowRight size={16} /></>}
                        </button>

                        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: 10 }}>
                            <div style={{ flex: 1, height: 1, background: "#f0e8e0" }} />
                            <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>OR</span>
                            <div style={{ flex: 1, height: 1, background: "#f0e8e0" }} />
                        </div>

                        <button
                            onClick={handleGoogle}
                            style={{ width: "100%", padding: 14, border: "1.5px solid #e0d4cc", borderRadius: 999, background: "white", fontSize: 15, fontWeight: 700, color: "#2D1B10", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "'Nunito', sans-serif" }}
                        >
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.9z" />
                                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z" />
                                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3C33.9 31.2 32 33.7 29.6 35.5l6.2 5.2C41.4 37.3 44 31 44 24c0-1.3-.1-2.5-.4-3.9z" />
                            </svg>
                            Continue with Google
                        </button>
                    </>
                ) : (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>6-DIGIT OTP</label>
                            <input
                                type="number"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                                onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                                placeholder="Enter OTP"
                                maxLength={6}
                                style={{ width: "100%", padding: "14px 16px", border: "1.5px solid #FFE0CC", borderRadius: 12, fontSize: 24, fontWeight: 700, textAlign: "center", letterSpacing: 8, color: "#2D1B10", outline: "none", fontFamily: "'Nunito', sans-serif", background: "#FEFAF6", boxSizing: "border-box" }}
                            />
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.length < 6}
                            className="btn-primary"
                            style={{ width: "100%", padding: 14, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? "Verifying…" : <>Verify & Login <ArrowRight size={16} /></>}
                        </button>

                        <button
                            onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                            style={{ width: "100%", marginTop: 12, background: "none", border: "none", fontSize: 13, color: "#aaa", cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}
                        >
                            ← Change phone number
                        </button>
                    </>
                )}

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#999" }}>
                    New here?{" "}
                    <a href="/signup" style={{ color: "#FFB38E", fontWeight: 700, textDecoration: "none" }}>Create account</a>
                </p>
            </div>
        </div>
    );
}
