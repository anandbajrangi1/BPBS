import { notFound } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { prisma } from "@/lib/prisma";

export default async function PublicPageReader({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await prisma.page.findUnique({
        where: { slug }
    });

    if (!page) notFound();

    return (
        <div className="app-container">
            <Header title={page.title} showBack={true} />
            <div className="pb-nav" style={{ overflowY: "auto", background: "white", minHeight: "100vh" }}>
                <div style={{ padding: "24px 20px" }}>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 32, fontWeight: 700, color: "#2D1B10", marginBottom: 20 }}>
                        {page.title}
                    </h1>
                    <div
                        style={{
                            fontSize: 16,
                            lineHeight: "1.7",
                            color: "#4B2B1F",
                            whiteSpace: "pre-wrap"
                        }}
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
