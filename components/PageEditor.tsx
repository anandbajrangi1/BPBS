"use client";
import { useState } from "react";
import { ChevronLeft, Save, Loader2, Link as LinkIcon, Type, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageEditorProps {
    initialData?: {
        id?: string;
        title: string;
        slug: string;
        content: string;
    };
    isNew?: boolean;
}

export default function PageEditor({ initialData, isNew = false }: PageEditorProps) {
    const [form, setForm] = useState(initialData || { title: "", slug: "", content: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = isNew ? "/api/pages" : `/api/pages/${initialData?.id}`;
            const method = isNew ? "POST" : "PATCH";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                router.push("/admin/pages");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to save page");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const autoSlug = (title: string) => {
        if (!isNew) return;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setForm(p => ({ ...p, title, slug }));
    };

    return (
        <div style={{ padding: "24px 32px" }}>
            <div style={{ marginBottom: 24 }}>
                <Link href="/admin/pages" style={{ textDecoration: "none", color: "#888", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                    <ChevronLeft size={16} /> BACK TO PAGES
                </Link>
                <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>
                    {isNew ? "Create New Page" : `Edit: ${initialData?.title}`}
                </h1>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
                {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: 12, marginBottom: 20, fontSize: 14 }}>{error}</div>}

                <div style={{ background: "white", borderRadius: 20, padding: 32, boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>PAGE TITLE</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <Type size={16} color="#FFB38E" />
                                <input
                                    required
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => isNew ? autoSlug(e.target.value) : setForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. About Us"
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent" }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>SLUG (URL PATH)</label>
                            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", gap: 10, background: "#FEFAF6" }}>
                                <LinkIcon size={16} color="#FFB38E" />
                                <input
                                    required
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))}
                                    placeholder="about-us"
                                    disabled={!isNew}
                                    style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", opacity: isNew ? 1 : 0.6 }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 8 }}>PAGE CONTENT (HTML/TEXT)</label>
                        <div style={{ border: "1.5px solid #FFE0CC", borderRadius: 12, padding: "12px 16px", background: "#FEFAF6" }}>
                            <textarea
                                required
                                value={form.content}
                                onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
                                placeholder="Enter page content here..."
                                style={{ width: "100%", minHeight: 400, border: "none", outline: "none", fontSize: 15, background: "transparent", resize: "vertical", lineHeight: "1.6" }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 12, opacity: loading ? 0.7 : 1 }}>
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? "Saving..." : "Save Page"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
