"use client";
import { useEffect, useState } from "react";
import BookEditor from "@/components/BookEditor";
import { Loader2 } from "lucide-react";

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
    const [book, setBook] = useState<any>(null);

    useEffect(() => {
        params.then(({ id }) => {
            fetch(`/api/books/${id}`)
                .then(res => res.json())
                .then(data => setBook(data));
        });
    }, [params]);

    if (!book) return (
        <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
            <Loader2 className="animate-spin" size={32} />
        </div>
    );

    return <BookEditor initialData={book} />;
}
