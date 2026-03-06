import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

export default async function MyCoursesPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const enrollments = await prisma.courseEnrollment.findMany({
        where: { userId: session.user.id },
        include: { course: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="app-container">
            <Header title="My Courses" showBack={true} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                <div style={{ padding: "16px" }}>
                    {enrollments.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 20px" }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
                            <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 700, color: "#2D1B10" }}>No courses joined yet</h3>
                            <p style={{ fontSize: 14, color: "#999", marginBottom: 24 }}>Explore our spiritual courses and start your journey today!</p>
                            <Link href="/courses" className="btn-primary" style={{ textDecoration: "none", display: "inline-block", padding: "12px 24px" }}>
                                Browse Courses
                            </Link>
                        </div>
                    ) : (
                        enrollments.map((e: any) => (
                            <Link key={e.id} href={`/courses/${e.courseId}`} style={{ textDecoration: "none" }}>
                                <div
                                    style={{
                                        background: "white",
                                        borderRadius: 16,
                                        padding: "16px",
                                        marginBottom: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        boxShadow: "0 2px 10px rgba(75,43,31,0.05)",
                                    }}
                                >
                                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4B2B1F", fontSize: 20, flexShrink: 0 }}>
                                        📿
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: "#2D1B10", marginBottom: 2 }}>{e.course.title}</div>
                                        <div style={{ display: "flex", gap: 12 }}>
                                            <span style={{ fontSize: 11, color: "#999", display: "flex", alignItems: "center", gap: 4 }}><BookOpen size={10} /> {e.course.lessons} lessons</span>
                                            <span style={{ fontSize: 11, color: "#999", display: "flex", alignItems: "center", gap: 4 }}><Clock size={10} /> {e.course.duration}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} color="#ccc" />
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
