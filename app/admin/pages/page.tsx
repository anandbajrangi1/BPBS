"use client";
import { useState, useEffect } from "react";
import { FileText, Plus, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminPagesList() {
    const [pages, setPages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch("/api/pages");
            if (res.ok) setPages(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const deletePage = async (id: string, title: string) => {
        if (!confirm(`Delete page "${title}"?`)) return;
        try {
            const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
            if (res.ok) setPages(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div style={{ padding: "24px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>
                        Pages Management
                    </h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>Manage About Us, Privacy Policy, and other content</p>
                </div>
                <Link href="/admin/pages/new" style={{ textDecoration: "none" }}>
                    <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12 }}>
                        <Plus size={18} /> Add New Page
                    </button>
                </Link>
            </div>

            <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#FFF8F0" }}>
                            {["Page Title", "Slug", "Last Updated", "Actions"].map((h) => (
                                <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>
                                    {h.toUpperCase()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading...</td></tr>
                        ) : pages.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#888" }}>No pages found.</td></tr>
                        ) : pages.map((page, i) => (
                            <tr key={page.id} style={{ borderTop: "1px solid #f7f0ea", background: i % 2 === 0 ? "white" : "#FEFAF6" }}>
                                <td style={{ padding: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFF3EC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <FileText size={16} color="#FFB38E" />
                                        </div>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{page.title}</span>
                                    </div>
                                </td>
                                <td style={{ padding: "16px", fontSize: 13, color: "#666" }}>
                                    <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>/{page.slug}</code>
                                </td>
                                <td style={{ padding: "16px", fontSize: 13, color: "#999" }}>
                                    {new Date(page.updatedAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: "16px" }}>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <Link href={`/pages/${page.slug}`} target="_blank" style={{ textDecoration: "none" }}>
                                            <button style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#f0f0f0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="View Public">
                                                <ExternalLink size={14} color="#666" />
                                            </button>
                                        </Link>
                                        <Link href={`/admin/pages/${page.id}`} style={{ textDecoration: "none" }}>
                                            <button style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#FFF3EC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Edit">
                                                <Edit size={14} color="#FFB38E" />
                                            </button>
                                        </Link>
                                        <button onClick={() => deletePage(page.id, page.title)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Delete">
                                            <Trash2 size={14} color="#dc2626" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
