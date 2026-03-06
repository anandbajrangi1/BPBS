"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Play } from "lucide-react";

type Kirtan = {
    id: string;
    title: string;
    artist: string;
    duration: string;
    type: string;
    category: string | null;
    plays: number;
    url: string | null;
    featured: boolean;
};

export default function AdminKirtansPage() {
    const [kirtans, setKirtans] = useState<Kirtan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", artist: "", duration: "", type: "kirtan", url: "", featured: false });

    useEffect(() => {
        fetchKirtans();
    }, []);

    const fetchKirtans = async () => {
        try {
            const res = await fetch("/api/kirtans");
            if (res.ok) setKirtans(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addKirtan = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/kirtans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                const added = await res.json();
                setKirtans((p) => [added, ...p]);
                setShowForm(false);
                setForm({ title: "", artist: "", duration: "", type: "kirtan", url: "", featured: false });
            }
        } catch (err) {
            console.error("Failed to add kirtan");
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this audio track?")) return;
        try {
            const res = await fetch(`/api/kirtans/${id}`, { method: "DELETE" });
            if (res.ok) {
                setKirtans((p) => p.filter((k) => k.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete kirtan");
        }
    };

    const toggleFeatured = async (id: string, current: boolean) => {
        try {
            const res = await fetch(`/api/kirtans/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: !current })
            });
            if (res.ok) {
                setKirtans((p) => p.map((k) => k.id === id ? { ...k, featured: !current } : k));
            }
        } catch (err) {
            console.error("Failed to toggle featured status");
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>Audio Library</h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{kirtans.length} tracks available</p>
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
                    <Plus size={16} /> Add Track
                </button>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {/* Form */}
                {showForm && (
                    <form onSubmit={addKirtan} style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>Upload Audio</h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>TITLE</label>
                                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>ARTIST / SINGER</label>
                                <input required value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>DURATION (e.g. 5:30)</label>
                                <input required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>TYPE</label>
                                <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box", background: "white" }}>
                                    <option value="kirtan">Kirtan</option>
                                    <option value="bhajan">Bhajan</option>
                                    <option value="stotra">Stotra / Mantra</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>AUDIO URL (S3 / CDN Link)</label>
                                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
                                <input type="checkbox" id="feat" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#FFB38E" }} />
                                <label htmlFor="feat" style={{ fontSize: 14, color: "#4B2B1F", fontWeight: 700 }}>Featured Track (Show prominently on top)</label>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                            <button type="submit" style={{ flex: 1, background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, color: "#4B2B1F", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 15 }}>
                                Save Audio Track
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: "#f0e8e0", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, color: "#666", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 15 }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Data Grid */}
                <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#FFF8F0" }}>
                                {["Track", "Artist", "Type", "Stats", "Status", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>
                                        {h.toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading library...</td></tr>
                            ) : kirtans.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#888" }}>No audio tracks uploaded yet.</td></tr>
                            ) : kirtans.map((kirtan, i) => (
                                <tr key={kirtan.id} style={{ borderTop: "1px solid #f7f0ea", background: i % 2 === 0 ? "white" : "#FEFAF6" }}>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4B2B1F", flexShrink: 0 }}>
                                                <Play fill="#4B2B1F" size={16} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{kirtan.title}</div>
                                                <div style={{ fontSize: 12, color: "#999" }}>{kirtan.duration}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#555", fontWeight: 600 }}>{kirtan.artist}</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, background: "#c8f5c8", color: "#166534", padding: "3px 8px", borderRadius: 999, textTransform: "uppercase" }}>
                                            {kirtan.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#666" }}>{kirtan.plays.toLocaleString()} plays</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                            <input type="checkbox" checked={kirtan.featured} onChange={() => toggleFeatured(kirtan.id, kirtan.featured)} style={{ accentColor: "#FFB38E" }} />
                                            <span style={{ fontSize: 12, color: kirtan.featured ? "#4B2B1F" : "#999", fontWeight: kirtan.featured ? 700 : 400 }}>Featured</span>
                                        </label>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <button onClick={() => remove(kirtan.id)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                            <Trash2 size={14} color="#dc2626" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
