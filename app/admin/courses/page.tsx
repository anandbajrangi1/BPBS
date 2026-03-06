"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, BookOpen, Clock, Users } from "lucide-react";

type Course = {
    id: string;
    title: string;
    instructor: string;
    lessons: any[];
    duration: string;
    level: string;
    enrolled: number;
    rating: number;
    description: string;
    featured: boolean;
};

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "", instructor: "", duration: "",
        level: "Beginner", description: "", featured: false
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/courses");
            if (res.ok) setCourses(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                const added = await res.json();
                setCourses((prev) => [added, ...prev]);
                setShowForm(false);
                setForm({ title: "", instructor: "", duration: "", level: "Beginner", description: "", featured: false });
            }
        } catch (err) {
            console.error("Failed to add course");
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this course and all its data?")) return;
        try {
            const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCourses((prev) => prev.filter((c: Course) => c.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete course");
        }
    };

    const toggleFeatured = async (id: string, current: boolean) => {
        try {
            const res = await fetch(`/api/courses/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ featured: !current })
            });
            if (res.ok) {
                setCourses((prev) => prev.map((c: Course) => c.id === id ? { ...c, featured: !current } : c));
            }
        } catch (err) {
            console.error("Failed to toggle featured status");
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>Course Management</h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{courses.length} structured courses</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
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
                    <Plus size={16} /> Create Course
                </button>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {/* Form */}
                {showForm && (
                    <form onSubmit={addCourse} style={{ background: "white", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>New Course Details</h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>COURSE TITLE</label>
                                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>INSTRUCTOR / SPEAKER</label>
                                <input required value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>TOTAL DURATION (e.g. 5h 30m)</label>
                                <input required value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>DIFFICULTY LEVEL</label>
                                <select required value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box", background: "white" }}>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="All Levels">All Levels</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
                                <input type="checkbox" id="cfeat" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#FFB38E" }} />
                                <label htmlFor="cfeat" style={{ fontSize: 14, color: "#4B2B1F", fontWeight: 700 }}>Featured Course (Highlight on App)</label>
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", marginBottom: 6, display: "block" }}>COURSE DESCRIPTION</label>
                                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #FFE0CC", fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                            <button type="submit" style={{ flex: 1, background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, color: "#4B2B1F", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 15 }}>
                                Publish Course
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: "#f0e8e0", border: "none", borderRadius: 10, padding: "12px", fontWeight: 700, color: "#666", cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 15 }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Data Grid */}
                <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#FFF8F0" }}>
                                {["Course", "Instructor", "Details", "Enrolled", "Status", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>
                                        {h.toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading courses...</td></tr>
                            ) : courses.length === 0 ? (
                                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "#888" }}>No courses created yet.</td></tr>
                            ) : courses.map((course: Course, i: number) => (
                                <tr key={course.id} style={{ borderTop: "1px solid #f7f0ea", background: i % 2 === 0 ? "white" : "#FEFAF6" }}>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4B2B1F", flexShrink: 0, fontSize: 18 }}>
                                                📿
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10", marginBottom: 2 }}>{course.title}</div>
                                                <div style={{ fontSize: 11, fontWeight: 800, color: "#FFB38E", textTransform: "uppercase" }}>{course.level}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#555", fontWeight: 600 }}>{course.instructor}</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#888" }}><BookOpen size={12} /> {course.lessons.length} lessons</div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#888" }}><Clock size={12} /> {course.duration}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#4B2B1F", fontWeight: 800 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={14} color="#FFB38E" /> {course.enrolled.toLocaleString()} users</div>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                            <input type="checkbox" checked={course.featured} onChange={() => toggleFeatured(course.id, course.featured)} style={{ accentColor: "#FFB38E" }} />
                                            <span style={{ fontSize: 12, color: course.featured ? "#4B2B1F" : "#999", fontWeight: course.featured ? 700 : 400 }}>Featured</span>
                                        </label>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <Link href={`/admin/courses/${course.id}/lessons`} style={{ width: 32, height: 32, borderRadius: 8, background: "#FEFAF6", border: "1.5px solid #FFE0CC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", textDecoration: "none" }}>
                                                <BookOpen size={14} color="#FFB38E" />
                                            </Link>
                                            <button onClick={() => remove(course.id)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
        </div>
    );
}
