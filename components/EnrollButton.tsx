"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EnrollButton({ courseId }: { courseId: string }) {
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/courses/enroll?courseId=${courseId}`)
            .then((res) => res.json())
            .then((data) => setEnrolled(!!data.enrolled))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [courseId]);

    const handleEnroll = async () => {
        try {
            const res = await fetch("/api/courses/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId }),
            });
            if (res.ok) {
                setEnrolled(true);
            } else if (res.status === 401) {
                window.location.href = "/login";
            }
        } catch (err) {
            console.error("Enrollment failed");
        }
    };

    if (loading) {
        return (
            <button className="btn-primary" disabled style={{ width: "100%", opacity: 0.6 }}>
                Checking...
            </button>
        );
    }

    return (
        <button
            onClick={() => enrolled ? router.push("/profile/courses") : handleEnroll()}
            className="btn-primary"
            style={{
                width: "100%",
                padding: 15,
                fontSize: 17,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: enrolled ? "#F0E8E0" : undefined,
                color: enrolled ? "#666" : undefined,
                border: enrolled ? "1.5px solid #F0E8E0" : undefined,
                cursor: "pointer",
            }}
        >
            {enrolled ? "✅ Enrolled — Continue Learning" : "📚 Start Course — Free"}
        </button>
    );
}
