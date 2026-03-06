import { Users, CalendarDays, HeartHandshake, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" }
    });

    const events = await prisma.event.findMany({
        where: { date: { gte: new Date() } }
    });

    const donations = await prisma.donation.findMany({
        where: { status: "SUCCESS" },
        include: { user: true },
        orderBy: { createdAt: "desc" }
    });

    const totalDonations = donations.reduce((acc: number, d: any) => acc + d.amount, 0);
    return (
        <div>
            {/* Top bar */}
            <div
                style={{
                    background: "white",
                    padding: "20px 32px",
                    borderBottom: "1px solid #f0e8e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>
                        Dashboard
                    </h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>Hare Krishna! Here's your overview.</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                        }}
                    >
                        🙏
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>Admin</div>
                        <div style={{ fontSize: 12, color: "#999" }}>Super Admin</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: "28px 32px" }}>
                {/* Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
                    {[
                        { icon: Users, label: "Total Users", value: users.length, sub: "Registered", color: "#FFB38E" },
                        { icon: CalendarDays, label: "Events", value: events.length, sub: "Upcoming", color: "#FFDA6C" },
                        { icon: HeartHandshake, label: "Donations", value: `₹${(totalDonations / 100).toLocaleString()}`, sub: "Total", color: "#c8f5c8" },
                        { icon: TrendingUp, label: "Active Users", value: users.filter((u: any) => u.status === "ACTIVE").length, sub: "Currently active", color: "#FFE0CC" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            style={{
                                background: "white",
                                borderRadius: 16,
                                padding: "20px 20px",
                                boxShadow: "0 2px 16px rgba(75,43,31,0.07)",
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    background: stat.color,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <stat.icon size={20} color="#4B2B1F" />
                            </div>
                            <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#666", marginBottom: 3 }}>{stat.label}</div>
                            <div style={{ fontSize: 11, color: "#aaa" }}>{stat.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Recent users + recent donations */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {/* Recent users */}
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: "20px",
                            boxShadow: "0 2px 16px rgba(75,43,31,0.07)",
                        }}
                    >
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>
                            Recent Users
                        </h2>
                        {users.slice(0, 5).map((user: any) => (
                            <div
                                key={user.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 0",
                                    borderBottom: "1px solid #f7f0ea",
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 16,
                                        flexShrink: 0,
                                    }}
                                >
                                    🙏
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{user.name || "Devotee"}</div>
                                    <div style={{ fontSize: 11, color: "#999" }}>{user.phone}</div>
                                </div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        padding: "3px 8px",
                                        borderRadius: 999,
                                        background: user.status === "ACTIVE" ? "#c8f5c8" : "#f0f0f0",
                                        color: user.status === "ACTIVE" ? "#2a7a2a" : "#888",
                                    }}
                                >
                                    {user.status === "ACTIVE" ? "active" : "blocked"}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent donations */}
                    <div
                        style={{
                            background: "white",
                            borderRadius: 16,
                            padding: "20px",
                            boxShadow: "0 2px 16px rgba(75,43,31,0.07)",
                        }}
                    >
                        <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 16 }}>
                            Recent Donations
                        </h2>
                        {donations.slice(0, 5).map((d: any) => (
                            <div
                                key={d.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 0",
                                    borderBottom: "1px solid #f7f0ea",
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "#FFF3EC",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 16,
                                        flexShrink: 0,
                                    }}
                                >
                                    🪔
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{d.user.name || "Devotee"}</div>
                                    <div style={{ fontSize: 11, color: "#999" }}>{d.purpose}</div>
                                </div>
                                <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 700, color: "#FFB38E" }}>
                                    ₹{(d.amount / 100).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick links */}
                <div style={{ marginTop: 20 }}>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10", marginBottom: 14 }}>
                        Quick Actions
                    </h2>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {[
                            { href: "/admin/events", label: "➕ Create Event" },
                            { href: "/admin/content", label: "📤 Upload Content" },
                            { href: "/admin/slides", label: "🖼️ Manage Slides" },
                            { href: "/admin/donations", label: "📊 Donation Report" },
                        ].map((a) => (
                            <a
                                key={a.href}
                                href={a.href}
                                style={{
                                    background: "white",
                                    border: "1.5px solid #FFE0CC",
                                    borderRadius: 12,
                                    padding: "10px 18px",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#4B2B1F",
                                    textDecoration: "none",
                                    boxShadow: "0 2px 10px rgba(75,43,31,0.05)",
                                }}
                            >
                                {a.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
