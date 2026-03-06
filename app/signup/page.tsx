"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
    const [form, setForm] = useState({ name: "", phone: "", email: "" });

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((p) => ({ ...p, [field]: e.target.value }));

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
            <div style={{ fontSize: 56, marginBottom: 14 }}>🕉️</div>
            <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "white", marginBottom: 4 }}>Join BPBS</h1>
            <p style={{ color: "rgba(255,230,200,0.7)", marginBottom: 32, fontSize: 14 }}>Create your spiritual account</p>

            <div style={{ background: "white", borderRadius: 24, padding: "28px 24px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 600, color: "#2D1B10", marginBottom: 20 }}>Create Account 🙏</h2>

                {[
                    { label: "FULL NAME", field: "name", type: "text", placeholder: "Arjuna Das" },
                    { label: "PHONE NUMBER", field: "phone", type: "tel", placeholder: "+91 98765 43210" },
                    { label: "EMAIL", field: "email", type: "email", placeholder: "you@example.com" },
                ].map(({ label, field, type, placeholder }) => (
                    <div key={field} style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>{label}</label>
                        <input
                            type={type}
                            value={(form as any)[field]}
                            onChange={update(field)}
                            placeholder={placeholder}
                            style={{ width: "100%", padding: "12px 16px", border: "1.5px solid #FFE0CC", borderRadius: 12, fontSize: 15, color: "#2D1B10", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box", background: "#FEFAF6" }}
                        />
                    </div>
                ))}

                <Link href="/" style={{ textDecoration: "none" }}>
                    <button
                        className="btn-primary"
                        style={{ width: "100%", padding: "14px", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}
                    >
                        Create Account <ArrowRight size={16} />
                    </button>
                </Link>

                <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#999" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#FFB38E", fontWeight: 700, textDecoration: "none" }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
