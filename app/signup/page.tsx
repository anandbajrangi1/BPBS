"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, User, Phone, Mail, Lock, AtSign } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        username: "",
        name: "",
        phone: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((p) => ({ ...p, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?message=Account created! Please login.");
            } else {
                setError(data.error || "Signup failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

                {error && (
                    <div style={{ background: "#fee2e2", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {[
                        { label: "USERNAME", field: "username", type: "text", placeholder: "arjuna_das", icon: AtSign },
                        { label: "FULL NAME", field: "name", type: "text", placeholder: "Arjuna Das", icon: User },
                        { label: "PHONE NUMBER", field: "phone", type: "tel", placeholder: "+91 98765 43210", icon: Phone },
                        { label: "EMAIL", field: "email", type: "email", placeholder: "you@example.com", icon: Mail },
                        { label: "PASSWORD", field: "password", type: "password", placeholder: "••••••••", icon: Lock },
                    ].map(({ label, field, type, placeholder, icon: Icon }) => (
                        <div key={field} style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>{label}</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <Icon size={16} color="#FFB38E" />
                                <input
                                    required
                                    type={type}
                                    value={(form as any)[field]}
                                    onChange={update(field)}
                                    placeholder={placeholder}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", fontFamily: "'Nunito', sans-serif" }}
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: "100%", padding: "14px", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Creating..." : <>Create Account <ArrowRight size={16} /></>}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#999" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#FFB38E", fontWeight: 700, textDecoration: "none" }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
