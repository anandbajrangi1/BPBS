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
                <KirtanPlayerClient kirtans={kirtans as any} />
            </div>
            <BottomNav />
        </div>
    );
}
