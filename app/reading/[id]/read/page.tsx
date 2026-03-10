import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BookOpen, Settings, ChevronLeft, Type, Moon, Sun } from "lucide-react";

export default async function ReadingInterfacePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await (prisma.book as any).findUnique({
        where: { id }
    });

    if (!book) notFound();

    // If it's a PDF, we might want to redirect or embed a PDF viewer
    // For now, if pdfUrl exists, we provide a link to the PDF

    return (
        <div className="app-container" style={{ background: "#FDF9F6" }}>
            <Header title={book.title} showBack={true} />

            <div style={{ overflowY: "auto", height: "calc(100vh - 64px)" }}>
                {book.pdfUrl ? (
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
                        <div style={{ width: 100, height: 100, background: "#FFF3EC", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                            <BookOpen size={48} color="#FFB38E" />
                        </div>
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "#2D1B10", marginBottom: 12 }}>
                            {book.title}
                        </h2>
                        <p style={{ fontSize: 14, color: "#666", marginBottom: 32 }}>
                            This book is available in PDF format. Click below to open the digital reader.
                        </p>
                        <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", width: "100%" }}>
                            <button className="btn-primary" style={{ width: "100%", padding: "16px", borderRadius: 12, fontSize: 16 }}>
                                Open PDF Reader
                            </button>
                        </a>
                    </div>
                ) : (
                    <div style={{ padding: "32px 24px 60px" }}>
                        {/* Reading Controls Placeholder */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, color: "#999" }}>
                            <div style={{ display: "flex", gap: 16 }}>
                                <Type size={20} />
                                <Sun size={20} />
                            </div>
                            <Settings size={20} />
                        </div>

                        <div style={{
                            fontFamily: "'Crimson Text', serif",
                            fontSize: 18,
                            lineHeight: "1.8",
                            color: "#2D1B10",
                            maxWidth: 700,
                            margin: "0 auto"
                        }}>
                            <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 32 }}>
                                {book.title}
                            </h2>
                            <div
                                style={{ whiteSpace: "pre-wrap" }}
                                dangerouslySetInnerHTML={{ __html: book.content || "No content available." }}
                            />
                        </div>

                        <div style={{
                            marginTop: 64,
                            paddingTop: 32,
                            borderTop: "1px solid #EEE",
                            textAlign: "center",
                            color: "#999",
                            fontSize: 14,
                            fontStyle: "italic"
                        }}>
                            — End of Chapter —
                            <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 4 }}>
                                🌸 🌸 🌸
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
