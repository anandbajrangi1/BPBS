"use client";
import { useState } from "react";
import { X, User, Mail, Phone, Loader2 } from "lucide-react";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: {
        name: string;
        email: string;
        phone: string;
    };
    onUpdate: () => void;
}

export default function EditProfileModal({ isOpen, onClose, initialData, onUpdate }: EditProfileModalProps) {
    const [form, setForm] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                onUpdate();
                onClose();
            } else {
                setError(data.error || "Update failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
            <div style={{ background: "white", borderRadius: 24, padding: 28, width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "#2D1B10" }}>Edit Profile 🙏</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color="#888" /></button>
                </div>

                {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {[
                        { label: "FULL NAME", field: "name", type: "text", icon: User },
                        { label: "EMAIL", field: "email", type: "email", icon: Mail },
                        { label: "PHONE", field: "phone", type: "tel", icon: Phone },
                    ].map(({ label, field, type, icon: Icon }) => (
                        <div key={field} style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>{label}</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <Icon size={16} color="#FFB38E" />
                                <input
                                    type={type}
                                    value={(form as any)[field]}
                                    onChange={(e) => setForm(p => ({ ...p, [field]: e.target.value }))}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent" }}
                                />
                            </div>
                        </div>
                    ))}

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: 14, borderRadius: 12, marginTop: 10, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
