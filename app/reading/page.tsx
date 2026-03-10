import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Search, Filter, ArrowRight } from "lucide-react";

export default async function ReadingPage() {
    const books = await (prisma.book as any).findMany({
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });

    return (
        <div className="app-container">
            <Header title="Library" showBack={false} />

            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Hero Section */}
                <div style={{
                    background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                    padding: "24px 20px 40px",
                    color: "white"
                }}>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                        Spiritual Wisdom
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,230,200,0.8)", lineHeight: 1.5, maxWidth: "80%" }}>
                        Dive into the timeless teachings of the Vedas and find guidance for a balanced, spiritual life.
                    </p>
                </div>

                {/* Content */}
                <div style={{ padding: "0 16px", marginTop: -20 }}>
                    {/* Search Bar Placeholder */}
                    <div style={{
                        background: "white",
                        borderRadius: 14,
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        marginBottom: 24
                    }}>
                        <Search size={18} color="#999" />
                        <span style={{ fontSize: 14, color: "#999", flex: 1 }}>Search by book or author...</span>
                        <Filter size={18} color="#FFB38E" />
                    </div>

                    {/* Book Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                        {books.map((book: any) => (
                            <Link key={book.id} href={`/reading/${book.id}`} style={{ textDecoration: "none" }}>
                                <div style={{
                                    background: "white",
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    boxShadow: "0 2px 10px rgba(75,43,31,0.05)",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                    <div style={{
                                        position: "relative",
                                        aspectRatio: "3/4",
                                        background: "#FEFAF6",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderBottom: "1px solid #f0f0f0"
                                    }}>
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <BookOpen size={40} color="#FFB38E" opacity={0.3} />
                                        )}
                                        {book.featured && (
                                            <div style={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                background: "rgba(255,179,142,0.9)",
                                                color: "white",
                                                fontSize: 10,
                                                fontWeight: 800,
                                                padding: "3px 8px",
                                                borderRadius: 10,
                                                letterSpacing: 0.5
                                            }}>
                                                FEATURED
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: "12px" }}>
                                        <div style={{ fontSize: 11, color: "#FFB38E", fontWeight: 700, marginBottom: 4 }}>{book.category.toUpperCase()}</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10", lineHeight: 1.3, height: 36, overflow: "hidden" }}>{book.title}</div>
                                        <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>{book.author}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {books.length === 0 && (
                        <div style={{ textAlign: "center", padding: "40px 20px", color: "#999" }}>
                            <BookOpen size={48} style={{ marginBottom: 16, opacity: 0.2, margin: "0 auto 16px" }} />
                            <p style={{ fontSize: 14 }}>Our spiritual library is coming soon! 🙏</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
