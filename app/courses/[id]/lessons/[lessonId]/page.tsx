"use client";
import { useState, useEffect, use } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, PlayCircle, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LessonPlayerPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
    const { id: courseId, lessonId } = use(params) as any;
    const router = useRouter();

    const [lesson, setLesson] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        fetchData();
    }, [lessonId]);

    const fetchData = async () => {
        try {
            const [lRes, listRes, pRes] = await Promise.all([
                fetch(`/api/lessons/${lessonId}`),
                fetch(`/api/courses/${courseId}/lessons`),
                fetch(`/api/courses/${courseId}/progress`)
            ]);

            if (lRes.ok) setLesson(await lRes.json());
            if (listRes.ok) setLessons(await listRes.json());
            if (pRes.ok) setProgress(await pRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markComplete = async () => {
        setMarking(true);
        try {
            const res = await fetch(`/api/courses/${courseId}/progress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId, completed: true })
            });
            if (res.ok) {
                // Refresh progress
                const pRes = await fetch(`/api/courses/${courseId}/progress`);
                if (pRes.ok) setProgress(await pRes.json());

                // Find next lesson
                const currentIndex = lessons.findIndex(l => l.id === lessonId);
                if (currentIndex < lessons.length - 1) {
                    const next = lessons[currentIndex + 1];
                    router.push(`/courses/${courseId}/lessons/${next.id}`);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setMarking(false);
        }
    };

    if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading lesson...</div>;
    if (!lesson) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Lesson not found</div>;

    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
    const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;

    const isCompleted = progress?.completedIds?.includes(lessonId);

    return (
        <div className="app-container">
            <Header title={lesson.title} backHref={`/courses/${courseId}`} />

            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Video Player Placeholder */}
                <div style={{ width: "100%", aspectRatio: "16/9", background: "#000", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {lesson.videoUrl ? (
                        <iframe
                            src={lesson.videoUrl.replace("watch?v=", "embed/")}
                            style={{ width: "100%", height: "100%", border: "none" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                            <PlayCircle size={48} style={{ marginBottom: 12 }} />
                            <p>No video for this lesson</p>
                        </div>
                    )}
                </div>

                <div style={{ padding: "20px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 700, color: "#2D1B10" }}>
                            {lesson.title}
                        </h1>
                        {isCompleted && <CheckCircle size={24} color="#16a34a" fill="#dcfce7" />}
                    </div>

                    <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>
                        {lesson.description}
                    </p>

                    <div style={{ background: "#FEFAF6", border: "1.5px solid #FFE0CC", borderRadius: 16, padding: "16px 20px", marginBottom: 32 }}>
                        <div style={{ fontSize: 13, color: "#4B2B1F", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                            {lesson.content || "No content provided for this lesson."}
                        </div>
                    </div>

                    {/* Completion Button */}
                    {!isCompleted ? (
                        <button
                            disabled={marking}
                            onClick={markComplete}
                            className="btn-primary"
                            style={{ width: "100%", padding: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 12, marginBottom: 40 }}
                        >
                            {marking ? "Saving..." : "Mark Lesson as Complete"}
                        </button>
                    ) : (
                        <div style={{ background: "#dcfce7", color: "#16a34a", padding: "14px", borderRadius: 12, textAlign: "center", fontWeight: 700, marginBottom: 40, border: "1px solid #bbf7d0" }}>
                            ✅ Lesson Completed
                        </div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: "flex", gap: 12 }}>
                        {prevLesson && (
                            <Link
                                href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                                style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #FFE0CC", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", color: "#4B2B1F", fontSize: 14, fontWeight: 700 }}
                            >
                                <ArrowLeft size={16} /> Previous
                            </Link>
                        )}
                        {nextLesson && (
                            <Link
                                href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                                style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#FEFAF6", border: "1.5px solid #FFE0CC", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", color: "#4B2B1F", fontSize: 14, fontWeight: 700 }}
                            >
                                Next <ArrowRight size={16} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
