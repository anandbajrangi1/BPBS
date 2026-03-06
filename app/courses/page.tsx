import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";
import { BookOpen, Users, Clock, Star, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const LEVEL_COLORS: Record<string, string> = {
    Beginner: "#c8f5c8",
    Intermediate: "#FFE0CC",
    "All Levels": "#FFDA6C",
};

export default async function CoursesPage() {
    const courses = (await prisma.course.findMany({
        include: { lessons: true },
        orderBy: { createdAt: 'desc' }
    })) as any[];

    return (
        <div className="app-container">
            <Header title="Spiritual Courses" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>

                {/* Header banner */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "20px 20px 24px",
                    }}
                >
                    <p style={{ color: "rgba(255,230,200,0.7)", fontSize: 13, marginBottom: 4 }}>
                        📚 {courses.length} courses available
                    </p>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "white" }}>
                        Deepen Your Sadhana
                    </h2>
                </div>

                {/* Course cards */}
                <div style={{ padding: "20px 16px" }}>
                    {courses.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#888", marginTop: 40 }}>No courses available yet.</p>
                    ) : (
                        courses.map((course) => (
                            <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: "none" }}>
                                <div
                                    style={{
                                        background: "white",
                                        borderRadius: 18,
                                        marginBottom: 16,
                                        overflow: "hidden",
                                        boxShadow: "0 4px 20px rgba(75,43,31,0.08)",
                                    }}
                                >
                                    {/* Gradient banner */}
                                    <div
                                        style={{
                                            background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                            height: 96,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 44,
                                            position: "relative",
                                        }}
                                    >
                                        📿
                                        {course.featured && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: 10,
                                                    right: 10,
                                                    background: "#4B2B1F",
                                                    color: "#FFDA6C",
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    padding: "3px 10px",
                                                    borderRadius: 999,
                                                    letterSpacing: 1,
                                                }}
                                            >
                                                ⭐ FEATURED
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ padding: 16 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                            <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", flex: 1, marginRight: 8, lineHeight: 1.3 }}>
                                                {course.title}
                                            </h3>
                                            <span
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    color: "#4B2B1F",
                                                    background: LEVEL_COLORS[course.level] || "#FFDA6C",
                                                    padding: "2px 8px",
                                                    borderRadius: 999,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {course.level}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: 13, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>
                                            👤 {course.instructor}
                                        </p>
                                        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <BookOpen size={13} color="#FFB38E" />
                                                <span style={{ fontSize: 12, color: "#666" }}>{course.lessons?.length || 0} lessons</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <Clock size={13} color="#FFB38E" />
                                                <span style={{ fontSize: 12, color: "#666" }}>{course.duration}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <Users size={13} color="#FFB38E" />
                                                <span style={{ fontSize: 12, color: "#666" }}>{course.enrolled}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <Star size={14} fill="#FFDA6C" color="#FFDA6C" />
                                                <span style={{ fontSize: 13, fontWeight: 700, color: "#4B2B1F" }}>
                                                    {course.rating ? Number(course.rating).toFixed(1) : "5.0"}
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#FFB38E", fontWeight: 700, fontSize: 13 }}>
                                                Start Course <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
