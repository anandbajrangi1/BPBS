"use client";
import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Shield, Loader2 } from "lucide-react";

interface AdminEditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdate: () => void;
}

export default function AdminEditUserModal({ isOpen, onClose, user, onUpdate }: AdminEditUserModalProps) {
    const [form, setForm] = useState({ name: "", email: "", phone: "", role: "", status: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                role: user.role || "USER",
                status: user.status || "ACTIVE"
            });
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/users?id=${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                onUpdate();
                onClose();
            } else {
                const data = await res.json();
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
            <div style={{ background: "white", borderRadius: 24, padding: 28, width: "100%", maxWidth: 450, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "#2D1B10" }}>Edit User Account</h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color="#888" /></button>
                </div>

                {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                        <div style={{ gridColumn: "1 / span 2" }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>FULL NAME</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <User size={16} color="#FFB38E" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent" }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>EMAIL</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <Mail size={16} color="#FFB38E" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent" }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>PHONE</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <Phone size={16} color="#FFB38E" />
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent" }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>ROLE</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <Shield size={16} color="#FFB38E" />
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", appearance: "none" }}
                                >
                                    <option value="USER">User (Devotee)</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>STATUS</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <div style={{ width: 16, height: 16, borderRadius: "50%", background: form.status === 'ACTIVE' ? '#16a34a' : '#dc2626' }} />
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm(p => ({ ...p, status: e.target.value }))}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", appearance: "none" }}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="BLOCKED">Blocked</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: 14, borderRadius: 12, marginTop: 10, opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? "Saving..." : "Update Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
