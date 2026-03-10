"use client";
import { useState, useEffect } from "react";
import { BookOpen, Plus, Edit, Trash2, ExternalLink, Loader2, Star } from "lucide-react";
import Link from "next/link";

export default function AdminBooksList() {
    const [books, setBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch("/api/books");
            if (res.ok) setBooks(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteBook = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
            if (res.ok) {
                setBooks(prev => prev.filter(b => b.id !== id));
            } else {
                alert("Failed to delete book");
            }
        } catch (err) {
            console.error(err);
            alert("Delete failed");
        }
    };

    return (
        <div style={{ padding: "24px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>
                        Library Management
                    </h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>Manage spiritual texts, e-books, and PDF resources</p>
                </div>
                <Link href="/admin/books/new" style={{ textDecoration: "none" }}>
                    <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12 }}>
                        <Plus size={18} /> Add New Book
                    </button>
                </Link>
            </div>

            <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#FFF8F0" }}>
                            {["Book Info", "Category", "Type", "Status", "Actions"].map((h) => (
                                <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>
                                    {h.toUpperCase()}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#888" }}>
                                <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 10px" }} />
                                Loading books...
                            </td></tr>
                        ) : books.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#888" }}>No books found in the library.</td></tr>
                        ) : books.map((book, i) => (
                            <tr key={book.id} style={{ borderTop: "1px solid #f7f0ea", background: i % 2 === 0 ? "white" : "#FEFAF6" }}>
                                <td style={{ padding: "16px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 40,
                                            height: 54,
                                            borderRadius: 4,
                                            background: "#FFF3EC",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            border: "1px solid #FFE0CC"
                                        }}>
                                            {book.coverImage ? (
                                                <img src={book.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <BookOpen size={20} color="#FFB38E" />
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{book.title}</div>
                                            <div style={{ fontSize: 12, color: "#888" }}>by {book.author}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: "16px" }}>
                                    <span style={{ fontSize: 12, background: "#FFF3EC", color: "#FFB38E", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                                        {book.category}
                                    </span>
                                </td>
                                <td style={{ padding: "16px", fontSize: 13, color: "#666" }}>
                                    {book.pdfUrl ? "📄 PDF File" : "📝 Text Content"}
                                </td>
                                <td style={{ padding: "16px" }}>
                                    {book.featured && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#FFB38E", fontSize: 12, fontWeight: 700 }}>
                                            <Star size={14} fill="#FFB38E" /> Featured
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: "16px" }}>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <Link href={`/reading/${book.id}`} target="_blank" style={{ textDecoration: "none" }}>
                                            <button style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#f0f0f0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="View Public">
                                                <ExternalLink size={14} color="#666" />
                                            </button>
                                        </Link>
                                        <Link href={`/admin/books/${book.id}`} style={{ textDecoration: "none" }}>
                                            <button style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#FFF3EC", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Edit">
                                                <Edit size={14} color="#FFB38E" />
                                            </button>
                                        </Link>
                                        <button onClick={() => deleteBook(book.id, book.title)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Delete">
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
