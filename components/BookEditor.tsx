"use client";
import { useState } from "react";
import { ChevronLeft, Save, Loader2, BookOpen, Type, AlignLeft, Image as ImageIcon, Link as LinkIcon, Star, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BookEditorProps {
    initialData?: any;
    isNew?: boolean;
}

export default function BookEditor({ initialData, isNew = false }: BookEditorProps) {
    const [form, setForm] = useState(initialData || {
        title: "",
        author: "",
        description: "",
        category: "Spiritual",
        readTime: "10 min",
        coverImage: "",
        pdfUrl: "",
        content: "",
        featured: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = isNew ? "/api/books" : `/api/books/${initialData?.id}`;
            const method = isNew ? "POST" : "PATCH";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                router.push("/admin/books");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to save book");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "24px 32px" }}>
            <div style={{ marginBottom: 24 }}>
                <Link href="/admin/books" style={{ textDecoration: "none", color: "#888", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                    <ChevronLeft size={16} /> BACK TO LIBRARY
                </Link>
                <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>
                    {isNew ? "Add New Book" : `Edit: ${initialData?.title}`}
                </h1>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: 900 }}>
                {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: 12, marginBottom: 20, fontSize: 14 }}>{error}</div>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
                    {/* Main Content */}
                    <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>BOOK TITLE</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <Type size={16} color="#FFB38E" />
                                <input
                                    required
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Bhagavad Gita As It Is"
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent" }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>AUTHOR</label>
                                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                    <BookOpen size={16} color="#FFB38E" />
                                    <input
                                        required
                                        type="text"
                                        value={form.author}
                                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                                        placeholder="Srila Prabhupada"
                                        style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent" }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>CATEGORY</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    style={{ width: "100%", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", background: "#FEFAF6", outline: "none", fontSize: 15, color: "#2D1B10" }}
                                >
                                    <option>Spiritual</option>
                                    <option>Philosophy</option>
                                    <option>Meditation</option>
                                    <option>Scripture</option>
                                    <option>Biography</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>SYNOPSIS / DESCRIPTION</label>
                            <div style={{ border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", background: "#FEFAF6" }}>
                                <textarea
                                    required
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Enter a brief summary of the book..."
                                    style={{ width: "100%", border: "none", outline: "none", fontSize: 15, background: "transparent", resize: "vertical" }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, pdfUrl: "" })}
                                    style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: !form.pdfUrl ? "#FFF3EC" : "#f0f0f0", color: !form.pdfUrl ? "#FFB38E" : "#666", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                >
                                    Rich Text Editor
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, pdfUrl: "https://", content: "" })}
                                    style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: form.pdfUrl ? "#FFF3EC" : "#f0f0f0", color: form.pdfUrl ? "#FFB38E" : "#666", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                >
                                    PDF/External Link
                                </button>
                            </div>

                            {form.pdfUrl !== "" ? (
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>PDF URL</label>
                                    <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                        <LinkIcon size={16} color="#FFB38E" />
                                        <input
                                            type="text"
                                            value={form.pdfUrl}
                                            onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                                            placeholder="https://example.com/book.pdf"
                                            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent" }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>BOOK CONTENT</label>
                                    <div style={{ border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", background: "#FEFAF6" }}>
                                        <textarea
                                            rows={12}
                                            value={form.content}
                                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                                            placeholder="Paste book text here..."
                                            style={{ width: "100%", border: "none", outline: "none", fontSize: 14, background: "transparent", resize: "vertical", fontFamily: "serif" }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 16 }}>PUBLISHING SETTINGS</label>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 12, color: "#4B2B1F", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                        style={{ width: 18, height: 18 }}
                                    />
                                    <Star size={16} color={form.featured ? "#FFB38E" : "#888"} />
                                    Mark as Featured
                                </label>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>READ TIME</label>
                                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 10, padding: "8px 12px", gap: 8, background: "#FEFAF6" }}>
                                    <Clock size={16} color="#FFB38E" />
                                    <input
                                        type="text"
                                        value={form.readTime}
                                        onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                                        placeholder="15 min"
                                        style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent" }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>COVER IMAGE URL</label>
                                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 10, padding: "8px 12px", gap: 8, background: "#FEFAF6" }}>
                                    <ImageIcon size={16} color="#FFB38E" />
                                    <input
                                        type="text"
                                        value={form.coverImage}
                                        onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                                        placeholder="https://..."
                                        style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent" }}
                                    />
                                </div>
                                {form.coverImage && (
                                    <div style={{ marginTop: 12, borderRadius: 8, overflow: "hidden", border: "1px solid #FFE0CC" }}>
                                        <img src={form.coverImage} alt="Cover Preview" style={{ width: "100%", display: "block" }} />
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, marginTop: 12 }}>
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {loading ? "Saving..." : "Save Book"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
