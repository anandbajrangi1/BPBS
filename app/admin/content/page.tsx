"use client";
import { useState } from "react";
import { Upload, Video, Music, BookOpen, FileText, Trash2 } from "lucide-react";

const INITIAL_CONTENT = [
    { id: "1", title: "Hare Krishna Kirtan - Morning Session", type: "audio", size: "24 MB", uploader: "Admin", date: "2026-03-01" },
    { id: "2", title: "Bhagavad Gita Chapter 2 - Video Lecture", type: "video", size: "145 MB", uploader: "Admin", date: "2026-02-25" },
    { id: "3", title: "Japa Meditation Guide PDF", type: "document", size: "2 MB", uploader: "Admin", date: "2026-02-20" },
    { id: "4", title: "Damodarashtakam Audio", type: "audio", size: "18 MB", uploader: "Admin", date: "2026-02-15" },
];

const TYPE_ICON: Record<string, React.ElementType> = { video: Video, audio: Music, document: FileText };
const TYPE_COLOR: Record<string, string> = { video: "#FFB38E", audio: "#FFDA6C", document: "#c8f5c8" };

export default function AdminContentPage() {
    const [content, setContent] = useState(INITIAL_CONTENT);
    const [activeTab, setActiveTab] = useState("all");

    const filtered = activeTab === "all" ? content : content.filter((c) => c.type === activeTab);

    return (
        <div>
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>Content Management</h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>Upload and manage media content</p>
                </div>
                <label
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
                    <Upload size={16} /> Upload Content
                    <input type="file" style={{ display: "none" }} />
                </label>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {/* Upload drop zone */}
                <div
                    style={{
                        border: "2px dashed #FFB38E",
                        borderRadius: 16,
                        padding: "36px",
                        textAlign: "center",
                        background: "#FFF8F0",
                        marginBottom: 24,
                        cursor: "pointer",
                    }}
                >
                    <Upload size={36} color="#FFB38E" style={{ margin: "0 auto 12px" }} />
                    <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#4B2B1F", marginBottom: 6 }}>
                        Drop files here or click to upload
                    </p>
                    <p style={{ fontSize: 13, color: "#999" }}>Supports MP3, MP4, PDF, DOCX (max 500MB)</p>
                </div>

                {/* Filter tabs */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    {[
                        { key: "all", label: "All" },
                        { key: "video", label: "🎬 Videos" },
                        { key: "audio", label: "🎵 Audio" },
                        { key: "document", label: "📄 Documents" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            style={{
                                border: "1.5px solid",
                                borderColor: activeTab === t.key ? "#FFB38E" : "#e0d4cc",
                                borderRadius: 999,
                                padding: "7px 16px",
                                fontSize: 13,
                                fontWeight: 700,
                                color: activeTab === t.key ? "#4B2B1F" : "#888",
                                background: activeTab === t.key ? "#FFF3EC" : "white",
                                cursor: "pointer",
                                fontFamily: "'Nunito', sans-serif",
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content list */}
                <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                    {filtered.map((item, i) => {
                        const Icon = TYPE_ICON[item.type] || FileText;
                        return (
                            <div
                                key={item.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    padding: "16px 20px",
                                    borderBottom: i < filtered.length - 1 ? "1px solid #f7f0ea" : "none",
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        background: TYPE_COLOR[item.type] || "#FFB38E",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <Icon size={20} color="#4B2B1F" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10", marginBottom: 3 }}>{item.title}</div>
                                    <div style={{ fontSize: 12, color: "#999" }}>{item.size} · Uploaded {item.date}</div>
                                </div>
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        padding: "3px 10px",
                                        borderRadius: 999,
                                        textTransform: "uppercase",
                                        background: TYPE_COLOR[item.type] || "#FFB38E",
                                        color: "#4B2B1F",
                                    }}
                                >
                                    {item.type}
                                </span>
                                <button
                                    onClick={() => setContent((p) => p.filter((c) => c.id !== item.id))}
                                    style={{ background: "#fee2e2", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                >
                                    <Trash2 size={14} color="#dc2626" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
