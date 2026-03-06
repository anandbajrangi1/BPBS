import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { prisma } from "@/lib/prisma";
import KirtanPlayerClient from "./KirtanPlayerClient";

export const revalidate = 60;

export default async function KirtanPage() {
    const kirtans = await prisma.kirtan.findMany({
        orderBy: { plays: 'desc' }
    });

    return (
        <div className="app-container">
            <Header title="Kirtan & Bhajans" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Featured banner */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "24px 20px",
                        margin: "0",
                    }}
                >
                    <p style={{ color: "#FFDA6C", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
                        🎵 NOW FEATURED
                    </p>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>
                        Hare Krishna Mahamantra
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
                        H.H. Lokanath Swami · 18:42
                    </p>
                </div>
                <KirtanPlayerClient kirtans={kirtans as any} />
            </div>
            <BottomNav />
        </div>
    );
}
