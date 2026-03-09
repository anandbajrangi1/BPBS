import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

const menuItems = [
    { emoji: "🌙", label: "Dark Mode", sub: "Coming soon", href: "#" },
    { emoji: "🔔", label: "Notifications", sub: "Push & email alerts", href: "#" },
    { emoji: "📖", label: "Reading", sub: "Spiritual texts & e-books", href: "/reading" },
    { emoji: "📹", label: "Videos", sub: "Spiritual video library", href: "/videos" },
    { emoji: "📿", label: "Japa History", sub: "All chanting sessions", href: "/reporting" },
    { emoji: "💝", label: "Donation History", sub: "View all payments", href: "/donate" },
    { emoji: "👥", label: "Community", sub: "Connect with devotees", href: "#" },
    { emoji: "📞", label: "Contact Us", sub: "Reach the temple", href: "/pages/contact-us" },
    { emoji: "🛡️", label: "Privacy Policy", sub: "How we use your data", href: "/pages/privacy-policy" },
    { emoji: "ℹ️", label: "About BPBS", sub: "Our mission & vision", href: "/pages/about-us" },
    { emoji: "🛠️", label: "Admin Panel", sub: "Management dashboard", href: "/admin" },
];

export default function MorePage() {
    return (
        <div className="app-container">
            <Header title="More" showBack={false} />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "20px 20px 24px",
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: 40, marginBottom: 8 }}>🕉️</div>
                    <p style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, color: "white", fontStyle: "italic" }}>
                        "Chant Hare Krishna and be happy!"
                    </p>
                    <p style={{ color: "rgba(255,230,200,0.6)", fontSize: 12, marginTop: 4 }}>— Srila Prabhupada</p>
                </div>

                <div style={{ padding: "16px 16px" }}>
                    {menuItems.map((item) => (
                        <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                            <div
                                style={{
                                    background: "white",
                                    borderRadius: 14,
                                    padding: "14px 16px",
                                    marginBottom: 10,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    boxShadow: "0 2px 10px rgba(75,43,31,0.05)",
                                }}
                            >
                                <span style={{ fontSize: 24, width: 36, height: 36, background: "#FFF3EC", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {item.emoji}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{item.label}</div>
                                    <div style={{ fontSize: 12, color: "#999" }}>{item.sub}</div>
                                </div>
                                <span style={{ color: "#ccc", fontSize: 20 }}>›</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{ padding: "0 16px 16px" }}>
                    <div style={{ background: "#FFF3EC", borderRadius: 14, padding: "14px 16px", textAlign: "center", border: "1px solid #FFE0CC" }}>
                        <p style={{ fontSize: 12, color: "#888" }}>BPBS App · Version 1.0.0</p>
                        <p style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>Hare Krishna! 🙏</p>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
