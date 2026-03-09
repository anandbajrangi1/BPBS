"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Image,
    HeartHandshake,
    FileVideo,
    BookOpen,
    Music,
    Heart,
    ChevronRight,
    LogOut,
} from "lucide-react";

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/events", icon: CalendarDays, label: "Events" },
    { href: "/admin/seva", icon: Heart, label: "Seva" },
    { href: "/admin/courses", icon: BookOpen, label: "Courses" },
    { href: "/admin/kirtans", icon: Music, label: "Kirtans" },
    { href: "/admin/slides", icon: Image, label: "Slides" },
    { href: "/admin/pages", icon: FileVideo, label: "Pages" }, // Reusing FileVideo or FileText
    { href: "/admin/donations", icon: HeartHandshake, label: "Donations" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#F7F2EE", fontFamily: "'Nunito', sans-serif" }}>
            {/* Sidebar */}
            <aside
                className="admin-sidebar"
                style={{
                    position: "fixed",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 40,
                    overflowY: "auto",
                }}
            >
                {/* Logo */}
                <div style={{ padding: "28px 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
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
                                fontSize: 22,
                            }}
                        >
                            🕉️
                        </div>
                        <div>
                            <div style={{ color: "white", fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 700 }}>BPBS Admin</div>
                            <div style={{ color: "rgba(255,230,200,0.6)", fontSize: 11 }}>Control Panel</div>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ padding: "16px 12px", flex: 1 }}>
                    {navItems.map(({ href, icon: Icon, label }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "11px 14px",
                                    borderRadius: 12,
                                    marginBottom: 4,
                                    background: active ? "rgba(255,179,142,0.2)" : "transparent",
                                    border: active ? "1px solid rgba(255,179,142,0.3)" : "1px solid transparent",
                                    textDecoration: "none",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <Icon size={18} color={active ? "#FFB38E" : "rgba(255,255,255,0.5)"} />
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: active ? 700 : 500,
                                        color: active ? "#FFB38E" : "rgba(255,255,255,0.65)",
                                    }}
                                >
                                    {label}
                                </span>
                                {active && <ChevronRight size={14} color="#FFB38E" style={{ marginLeft: "auto" }} />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 14px",
                                borderRadius: 10,
                                color: "rgba(255,255,255,0.5)",
                                fontSize: 13,
                                cursor: "pointer",
                            }}
                        >
                            <LogOut size={15} />
                            View Mobile App
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ marginLeft: 240, flex: 1, padding: "0" }}>
                {children}
            </main>
        </div>
    );
}
