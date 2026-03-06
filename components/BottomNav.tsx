"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Heart, Music, MoreHorizontal } from "lucide-react";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/reporting", icon: BarChart2, label: "Reporting" },
    { href: "/seva", icon: Heart, label: "Seva" },
    { href: "/kirtan", icon: Music, label: "Kirtan" },
    { href: "/more", icon: MoreHorizontal, label: "More" },
];

export default function BottomNav() {
    const pathname = usePathname();

    // Hide on admin routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
        return null;
    }

    return (
        <nav
            style={{
                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 430,
                background: "white",
                borderTop: "1px solid #f0e8e0",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "8px 0 12px",
                zIndex: 100,
                boxShadow: "0 -4px 20px rgba(75,43,31,0.08)",
            }}
        >
            {navItems.map(({ href, icon: Icon, label }) => {
                const active = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            textDecoration: "none",
                            minWidth: 52,
                            transition: "all 0.2s ease",
                        }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 28,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 14,
                                background: active ? "linear-gradient(135deg, #FFB38E, #FFDA6C)" : "transparent",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <Icon
                                size={20}
                                style={{
                                    color: active ? "#4B2B1F" : "#aaa",
                                    strokeWidth: active ? 2.5 : 1.8,
                                }}
                            />
                        </div>
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: active ? 700 : 500,
                                color: active ? "#4B2B1F" : "#aaa",
                                fontFamily: "'Nunito', sans-serif",
                            }}
                        >
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
