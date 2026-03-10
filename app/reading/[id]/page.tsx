import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, User, Clock, Bookmark, Share2, ArrowRight, FileText } from "lucide-react";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await (prisma.book as any).findUnique({
        where: { id }
    });

    if (!book) notFound();

    return (
        <div className="app-container">
            <Header title="Book Details" showBack={true} />

            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Book Header */}
                <div style={{
                    padding: "32px 20px 24px",
                    textAlign: "center",
                    background: "white",
                    borderBottom: "1px solid #f0f0f0"
                }}>
                    <div style={{
                        width: 140,
                        height: 190,
                        margin: "0 auto 20px",
                        borderRadius: 8,
                        overflow: "hidden",
                        boxShadow: "0 8px 30px rgba(75,43,31,0.15)",
                        background: "#FEFAF6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #FFE0CC"
                    }}>
                        {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <BookOpen size={48} color="#FFB38E" opacity={0.3} />
                        )}
                    </div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "#2D1B10", marginBottom: 8 }}>
                        {book.title}
                    </h1>
                    <div style={{ fontSize: 14, color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <User size={14} />
                        {book.author}
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    background: "white",
                    padding: "16px 20px",
                    borderBottom: "1px solid #f0f0f0"
                }}>
                    <div style={{ textAlign: "center", borderRight: "1px solid #f0f0f0" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#FFB38E", marginBottom: 2 }}>{book.category}</div>
                        <div style={{ fontSize: 10, color: "#999", fontWeight: 700 }}>CATEGORY</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#2D1B10", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 2 }}>
                            <Clock size={13} color="#FFB38E" />
                            {book.readTime}
                        </div>
                        <div style={{ fontSize: 10, color: "#999", fontWeight: 700 }}>READ TIME</div>
                    </div>
                </div>

                {/* Description */}
                <div style={{ padding: "24px 20px" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2D1B10", marginBottom: 12 }}>Synopsis</h3>
                    <p style={{ fontSize: 14, color: "#4B2B1F", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                        {book.description}
                    </p>

                    <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
                        <Link href={`/reading/${book.id}/read`} style={{ flex: 1, textDecoration: "none" }}>
                            <button className="btn-primary" style={{ width: "100%", padding: "14px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                                <FileText size={18} />
                                Start Reading
                                <ArrowRight size={16} />
                            </button>
                        </Link>
                        <button style={{ width: 50, height: 50, borderRadius: 12, border: "1.5px solid #FFE0CC", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFB38E", cursor: "pointer" }}>
                            <Bookmark size={20} />
                        </button>
                        <button style={{ width: 50, height: 50, borderRadius: 12, border: "1.5px solid #FFE0CC", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFB38E", cursor: "pointer" }}>
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
