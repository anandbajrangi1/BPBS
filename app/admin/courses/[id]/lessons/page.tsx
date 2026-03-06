"use client";
import { useState, useEffect, use } from "react";
import { Plus, Trash2, Edit, ChevronLeft, Video, FileText, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Lesson = {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    content: string | null;
    order: number;
};

type Course = {
    id: string;
    title: string;
};

export default function AdminCourseLessonsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: courseId } = use(params);
    const router = useRouter();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [form, setForm] = useState({
        title: "", description: "", videoUrl: "", content: "", order: 0
    });

    useEffect(() => {
        fetchCourse();
        fetchLessons();
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}`);
            if (res.ok) setCourse(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLessons = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}/lessons`);
            if (res.ok) setLessons(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingLesson
            ? `/api/lessons/${editingLesson.id}`
            : `/api/courses/${courseId}/lessons`;
        const method = editingLesson ? "PATCH" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, order: Number(form.order) })
            });
            if (res.ok) {
                fetchLessons();
                setShowForm(false);
                setEditingLesson(null);
                setForm({ title: "", description: "", videoUrl: "", content: "", order: 0 });
            }
        } catch (err) {
            console.error("Failed to save lesson");
        }
    };

    const handleEdit = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setForm({
            title: lesson.title,
            description: lesson.description || "",
            videoUrl: lesson.videoUrl || "",
            content: lesson.content || "",
            order: lesson.order
        });
        setShowForm(true);
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this lesson?")) return;
        try {
            const res = await fetch(`/api/lessons/${id}`, { method: "DELETE" });
            if (res.ok) fetchLessons();
        } catch (err) {
            console.error("Failed to delete lesson");
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Link href="/admin/courses" style={{ color: "#999", display: "flex", alignItems: "center" }}>
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "#2D1B10" }}>
                            Lessons: {course?.title || "Loading..."}
                        </h1>
                        <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>Manage curriculum and content</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingLesson(null);
                        setForm({ title: "", description: "", videoUrl: "", content: "", order: lessons.length });
                        setShowForm(true);
                    }}
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
                    <Plus size={16} /> Add Lesson
                </button>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {/* Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>
                            {editingLesson ? "Edit Lesson" : "New Lesson"}
                        </h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>LESSON TITLE</label>
                                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>VIDEO URL (Optional)</label>
                                <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="YouTube/Vimeo/CDN link" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>SORT ORDER (Lower moves to top)</label>
                                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>SHORT DESCRIPTION</label>
                                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>LESSON CONTENT (Markdown supported)</label>
                                <textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full text content for the lesson..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                            <button type="submit" style={{ flex: 1, background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, color: "#4B2B1F", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 15 }}>
                                {editingLesson ? "Update Lesson" : "Publish Lesson"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: "#f0e8e0", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, color: "#666", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 15 }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Lessons List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>Loading lessons...</div>
                    ) : lessons.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 60, background: "white", borderRadius: 16, color: "#999", border: "2px dashed #f0e8e0" }}>
                            No lessons added yet. Click "Add Lesson" to start building the curriculum.
                        </div>
                    ) : lessons.map((lesson) => (
                        <div key={lesson.id} style={{ background: "white", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(75,43,31,0.05)", border: "1px solid #fcf8f5" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FEFAF6", border: "1.5px solid #FFE0CC", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFB38E", fontWeight: 800 }}>
                                    {lesson.order}
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#2D1B10" }}>{lesson.title}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                                        {lesson.videoUrl && <span style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 4 }}><Video size={12} /> Video Attached</span>}
                                        {lesson.content && <span style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 4 }}><FileText size={12} /> Content added</span>}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => handleEdit(lesson)} style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#f0e8e0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                    <Edit size={16} color="#666" />
                                </button>
                                <button onClick={() => remove(lesson.id)} style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                    <Trash2 size={16} color="#dc2626" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
