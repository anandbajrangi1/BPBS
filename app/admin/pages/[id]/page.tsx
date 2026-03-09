"use client";
import { useEffect, useState } from "react";
import PageEditor from "@/components/PageEditor";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const [page, setPage] = useState<any>(null);

    useEffect(() => {
        params.then(({ id }) => {
            fetch(`/api/pages/${id}`)
                .then(res => res.json())
                .then(data => setPage(data));
        });
    }, [params]);

    if (!page) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading editor...</div>;

    return <PageEditor initialData={page} />;
}
