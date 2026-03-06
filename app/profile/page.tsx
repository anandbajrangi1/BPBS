import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;

    // Fetch aggregated data
    const [user, japaData, donationData, enrollmentCount] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.japaSession.aggregate({
            where: { userId },
            _sum: { rounds: true }
        }),
        prisma.donation.aggregate({
            where: { userId, status: "SUCCESS" },
            _sum: { amount: true }
        }),
        prisma.courseEnrollment.count({
            where: { userId }
        })
    ]);

    // Calculate today's rounds
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysSessions = await prisma.japaSession.findMany({
        where: {
            userId,
            date: { gte: today }
        }
    });
    const todayRounds = todaysSessions.reduce((sum: number, s: any) => sum + s.rounds, 0);

    const displayName = user?.name || "Devotee";
    const displayPhone = user?.phone || "";
    const displayEmail = user?.email || "";
    const totalJapa = japaData._sum.rounds || 0;
    const totalDonation = donationData._sum.amount || 0;
    const dailyGoal = 16;

    return (
        <div className="app-container">
            <Header title="My Profile" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Profile hero */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "28px 20px 80px",
                        position: "relative",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #FFDA6C, #FFB38E)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 32,
                                flexShrink: 0,
                                border: "3px solid rgba(255,255,255,0.3)",
                            }}
                        >
                            🙏
                        </div>
                        <div>
                            <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 24, fontWeight: 700, color: "white", marginBottom: 4 }}>
                                {displayName}
                            </h2>
                            {displayPhone && <p style={{ fontSize: 13, color: "rgba(255,230,200,0.75)" }}>{displayPhone}</p>}
                            {displayEmail && <p style={{ fontSize: 13, color: "rgba(255,230,200,0.75)" }}>{displayEmail}</p>}
                        </div>
                    </div>
                </div>

                {/* Stats cards */}
                <div style={{ padding: "0 16px", marginTop: -40 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        {[
                            { label: "Japa Rounds", value: totalJapa, emoji: "📿" },
                            { label: "Donation (₹)", value: (totalDonation / 100).toLocaleString(), emoji: "🪔" },
                            { label: "Courses", value: enrollmentCount, emoji: "📚" },
                        ].map((s) => (
                            <div
                                key={s.label}
                                style={{
                                    background: "white",
                                    borderRadius: 14,
                                    padding: "16px 10px",
                                    textAlign: "center",
                                    boxShadow: "0 4px 20px rgba(75,43,31,0.1)",
                                }}
                            >
                                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.emoji}</div>
                                <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 700, color: "#4B2B1F" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: 10, color: "#999", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Japa goal */}
                <div style={{ padding: "20px 16px 0" }}>
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: 18,
                            boxShadow: "0 2px 12px rgba(75,43,31,0.06)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                            <div>
                                <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", marginBottom: 2 }}>
                                    📿 Today's Japa
                                </h3>
                                <p style={{ fontSize: 12, color: "#999" }}>Daily goal: {dailyGoal} rounds</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <span style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#FFB38E" }}>
                                    {todayRounds}
                                </span>
                                <span style={{ fontSize: 14, color: "#bbb" }}>/{dailyGoal}</span>
                            </div>
                        </div>
                        <div style={{ height: 10, background: "#f0e8e0", borderRadius: 5, overflow: "hidden" }}>
                            <div
                                style={{
                                    width: `${Math.min((todayRounds / dailyGoal) * 100, 100)}%`,
                                    height: "100%",
                                    background: "linear-gradient(90deg, #FFB38E, #FFDA6C)",
                                    borderRadius: 5,
                                    transition: "width 1s ease",
                                }}
                            />
                        </div>
                        <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
                            {dailyGoal > todayRounds ? `${dailyGoal - todayRounds} more rounds to complete today's goal 🙏` : "Daily goal completed! Hare Krishna!"}
                        </p>
                    </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: "16px 16px" }}>
                    {[
                        { emoji: "📅", label: "My Donations", sub: "View donation history", href: "/profile/donations" },
                        { emoji: "📚", label: "Saved Courses", sub: "Continue learning", href: "/profile/courses" },
                        { emoji: "🔔", label: "Notifications", sub: "Manage alerts", href: "#" },
                        { emoji: "🔒", label: "Privacy & Security", sub: "Account settings", href: "#" },
                        { emoji: "📞", label: "Help & Support", sub: "Contact us", href: "#" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            style={{
                                background: "white",
                                borderRadius: 14,
                                padding: "14px 16px",
                                marginBottom: 10,
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                boxShadow: "0 2px 10px rgba(75,43,31,0.05)",
                                cursor: "pointer",
                                textDecoration: "none"
                            }}
                        >
                            <span style={{ fontSize: 24 }}>{item.emoji}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{item.label}</div>
                                <div style={{ fontSize: 12, color: "#999" }}>{item.sub}</div>
                            </div>
                            <span style={{ color: "#ccc", fontSize: 20 }}>›</span>
                        </Link>
                    ))}
                </div>

                <div style={{ padding: "0 16px 16px" }}>
                    <SignOutButton />
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
