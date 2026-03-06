"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Heart, MapPin, Calendar, Edit2 } from "lucide-react";

type Seva = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    emoji: string;
    color: string;
};

export default function AdminSevaPage() {
    const [sevas, setSevas] = useState<Seva[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "", description: "", date: "", location: "", emoji: "🙏", color: "#FFB38E"
    });

    useEffect(() => {
        fetchSeva();
    }, []);

    const fetchSeva = async () => {
        try {
            const res = await fetch("/api/seva");
            if (res.ok) setSevas(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/seva", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                const added = await res.json();
                setSevas([added, ...sevas]);
                setShowForm(false);
                setForm({ title: "", description: "", date: "", location: "", emoji: "🙏", color: "#FFB38E" });
            }
        } catch (err) {
            console.error("Failed to add seva");
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this seva opportunity?")) return;
        try {
            const res = await fetch(`/api/seva/${id}`, { method: "DELETE" });
            if (res.ok) setSevas(sevas.filter(s => s.id !== id));
        } catch (err) {
            console.error("Failed to delete seva");
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>Seva Management</h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>Manage volunteer opportunities for the community</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
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
                    <Plus size={16} /> Create Opportunity
                </button>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {/* Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>New Opportunity Details</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>TITLE</label>
                                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", outline: "none" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>DATE / FREQUENCY</label>
                                <input required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. Every Sunday" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", outline: "none" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>LOCATION</label>
                                <input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", outline: "none" }} />
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>EMOJI</label>
                                    <input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", outline: "none" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>COLOR (HEX)</label>
                                    <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: "100%", height: 42, padding: 4, borderRadius: 10, border: "1.5px solid #FFE0CC", outline: "none", background: "white" }} />
                                </div>
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>DESCRIPTION</label>
                                <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", outline: "none", resize: "none" }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                            <button type="submit" style={{ flex: 1, background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", border: "none", borderRadius: 10, padding: 12, fontWeight: 700, color: "#4B2B1F", cursor: "pointer" }}>Publish Seva</button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: "#f0e8e0", border: "none", borderRadius: 10, padding: 12, fontWeight: 700, color: "#666", cursor: "pointer" }}>Cancel</button>
                        </div>
                    </form>
                )}

                {/* Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                    {isLoading ? (
                        <p style={{ color: "#888" }}>Loading sevas...</p>
                    ) : sevas.length === 0 ? (
                        <p style={{ color: "#888" }}>No seva opportunities yet.</p>
                    ) : sevas.map(s => (
                        <div key={s.id} style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 16px rgba(75,43,31,0.07)", position: "relative" }}>
                            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 12 }}>
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                                    {s.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2D1B10", marginBottom: 4 }}>{s.title}</h3>
                                    <p style={{ fontSize: 13, color: "#888", lineHeight: 1.4 }}>{s.description}</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #f7f0ea", paddingTop: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#666" }}>
                                    <Calendar size={14} color="#FFB38E" /> {s.date}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#666" }}>
                                    <MapPin size={14} color="#FFB38E" /> {s.location}
                                </div>
                            </div>
                            <button onClick={() => remove(s.id)} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                <Trash2 size={14} color="#dc2626" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
