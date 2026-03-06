"use client";
import { useState } from "react";
import { Plus, GripVertical, Trash2, Link } from "lucide-react";
import slidesData from "@/data/slides.json";

export default function AdminSlidesPage() {
    const [slides, setSlides] = useState(slidesData);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: "", subtitle: "", link: "", color: "#FFB38E" });

    const addSlide = () => {
        if (!form.title) return;
        const newSlide = { id: String(slides.length + 1), image: "", ...form };
        setSlides((p) => [...p, newSlide] as typeof slidesData);
        setForm({ title: "", subtitle: "", link: "", color: "#FFB38E" });
        setShowForm(false);
    };

    const remove = (id: string) => setSlides((p) => p.filter((s) => s.id !== id));

    return (
        <div>
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>Slideshow Manager</h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{slides.length} slides configured</p>
                </div>
                <button
                    onClick={() => setShowForm((s) => !s)}
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
                    <Plus size={16} /> Add Slide
                </button>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {/* Add form */}
                {showForm && (
                    <div style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                        <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>New Slide</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            {(["title", "subtitle", "link"] as const).map((field) => (
                                <div key={field} style={{ gridColumn: field === "link" ? "1 / -1" : "auto" }}>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>{field.toUpperCase()}</label>
                                    <input
                                        value={form[field]}
                                        onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #FFE0CC", borderRadius: 10, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 14 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>ACCENT COLOR</label>
                            <input type="color" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} style={{ width: 44, height: 36, borderRadius: 8, border: "1.5px solid #FFE0CC", cursor: "pointer", padding: 2 }} />
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                            <button onClick={addSlide} style={{ flex: 1, background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, color: "#4B2B1F", cursor: "pointer", fontSize: 14, fontFamily: "'Nunito', sans-serif" }}>
                                Add Slide
                            </button>
                            <button onClick={() => setShowForm(false)} style={{ flex: 1, background: "#f0e8e0", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, color: "#666", cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Slides list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {slides.map((slide, i) => (
                        <div
                            key={slide.id}
                            style={{
                                background: "white",
                                borderRadius: 14,
                                padding: "16px 20px",
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                boxShadow: "0 2px 12px rgba(75,43,31,0.07)",
                            }}
                        >
                            {/* Order handle */}
                            <GripVertical size={18} color="#ccc" style={{ cursor: "grab", flexShrink: 0 }} />

                            {/* Order badge */}
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: slide.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 800,
                                    fontSize: 14,
                                    color: "#4B2B1F",
                                    flexShrink: 0,
                                }}
                            >
                                {i + 1}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "#2D1B10" }}>{slide.title}</div>
                                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{slide.subtitle}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                                    <Link size={12} color="#FFB38E" />
                                    <span style={{ fontSize: 12, color: "#FFB38E" }}>{slide.link}</span>
                                </div>
                            </div>

                            {/* Preview swatch */}
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${slide.color}, #FFDA6C)`, flexShrink: 0 }} />

                            <button
                                onClick={() => remove(slide.id)}
                                style={{ background: "#fee2e2", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                            >
                                <Trash2 size={14} color="#dc2626" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
