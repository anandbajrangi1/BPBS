import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Heart, Calendar } from "lucide-react";

export default async function MyDonationsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const donations = await prisma.donation.findMany({
        where: { userId: session.user.id, status: "SUCCESS" },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="app-container">
            <Header title="My Donations" showBack={true} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                <div style={{ padding: "16px" }}>
                    {donations.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 20px" }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
                            <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 700, color: "#2D1B10" }}>No donations yet</h3>
                            <p style={{ fontSize: 14, color: "#999" }}>Your contributions help us spread Krishna consciousness globally.</p>
                        </div>
                    ) : (
                        donations.map((d: any) => (
                            <div
                                key={d.id}
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
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: "#FFF3EC", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFB38E", fontSize: 20, flexShrink: 0 }}>
                                    🪔
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#2D1B10" }}>{d.purpose}</div>
                                    <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
                                        <Calendar size={12} style={{ display: "inline", marginRight: 4 }} />
                                        {new Date(d.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 700, color: "#FFB38E" }}>
                                    ₹{(d.amount / 100).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
