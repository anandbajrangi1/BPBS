import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { BookOpen, Clock, Star, Users, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EnrollButton from "@/components/EnrollButton";

const LESSONS = [
    "Introduction & Paramparā",
    "Chapter 1 — Observing the Armies",
    "Chapter 2 — Contents of Gita (Part 1)",
    "Chapter 2 — Contents of Gita (Part 2)",
    "Chapter 3 — Karma-Yoga",
    "Chapter 4 — Transcendental Knowledge",
];

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = await prisma.course.findUnique({ where: { id } });

    if (!course) {
        notFound();
    }

    return (
        <div className="app-container">
            <Header title="Course Details" />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Hero */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "24px 20px 32px",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            background: "rgba(255,218,108,0.2)",
                            color: "#FFDA6C",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: 999,
                            letterSpacing: 1,
                            marginBottom: 10,
                        }}
                    >
                        {course.level.toUpperCase()}
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Crimson Text', serif",
                            fontSize: 26,
                            fontWeight: 700,
                            color: "white",
                            marginBottom: 8,
                            lineHeight: 1.3,
                        }}
                    >
                        {course.title}
                    </h1>
                    <p style={{ fontSize: 14, color: "rgba(255,230,200,0.75)", marginBottom: 16 }}>
                        👤 {course.instructor}
                    </p>
                    <div style={{ display: "flex", gap: 20 }}>
                        {[
                            { icon: BookOpen, val: `${course.lessons} lessons` },
                            { icon: Clock, val: course.duration },
                            { icon: Users, val: `${course.enrolled} enrolled` },
                        ].map(({ icon: Icon, val }) => (
                            <div key={val} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <Icon size={14} color="rgba(255,179,142,0.8)" />
                                <span style={{ fontSize: 13, color: "rgba(255,230,200,0.75)" }}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: "20px 16px" }}>
                    {/* Rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={16} fill={s <= Math.round(Number(course.rating) || 5) ? "#FFDA6C" : "none"} color="#FFDA6C" />
                        ))}
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#4B2B1F" }}>{course.rating ? Number(course.rating).toFixed(1) : "5.0"}</span>
                    </div>

                    <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 24, whiteSpace: "pre-wrap" }}>
                        {course.description}
                    </p>

                    {/* Curriculum */}
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 14 }}>
                        📋 Curriculum ({course.lessons} lessons)
                    </h2>
                    <div style={{ marginBottom: 24 }}>
                        {LESSONS.map((lesson, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    padding: "12px 0",
                                    borderBottom: "1px solid #f0e8e0",
                                }}
                            >
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        background: i < 2 ? "linear-gradient(135deg, #FFB38E, #FFDA6C)" : "#f0e8e0",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    {i < 2 ? (
                                        <Check size={14} color="#4B2B1F" />
                                    ) : (
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#999" }}>{i + 1}</span>
                                    )}
                                </div>
                                <span style={{ fontSize: 14, color: i < 2 ? "#4B2B1F" : "#666", fontWeight: i < 2 ? 700 : 400 }}>
                                    {lesson}
                                </span>
                            </div>
                        ))}
                        <p style={{ fontSize: 13, color: "#FFB38E", marginTop: 10, fontWeight: 700 }}>
                            +{course.lessons - LESSONS.length} more lessons…
                        </p>
                    </div>

                    <EnrollButton courseId={course.id} />
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
