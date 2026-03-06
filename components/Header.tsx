"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";

import { useSession } from "next-auth/react";

interface HeaderProps {
    title: string;
    showBack?: boolean;
    backHref?: string;
    rightAction?: React.ReactNode;
}

export default function Header({ title, showBack = true, backHref, rightAction }: HeaderProps) {
    const router = useRouter();
    const { data: session, status } = useSession();

    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "white",
                borderBottom: "1px solid #f0e8e0",
                position: "sticky",
                top: 0,
                zIndex: 50,
                backdropFilter: "blur(10px)",
            }}
        >
            {/* Left: back button */}
            <div style={{ width: 40 }}>
                {showBack && (
                    backHref ? (
                        <Link href={backHref}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                border: "none",
                                background: "#FFF3EC",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}>
                                <ArrowLeft size={18} color="#4B2B1F" />
                            </div>
                        </Link>
                    ) : (
                        <button
                            onClick={() => router.back()}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                border: "none",
                                background: "#FFF3EC",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <ArrowLeft size={18} color="#4B2B1F" />
                        </button>
                    )
                )}
            </div>

            {/* Center: title */}
            <h1
                style={{
                    fontFamily: "'Crimson Text', serif",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#4B2B1F",
                    letterSpacing: 0.3,
                    margin: 0,
                    flex: 1,
                    textAlign: "center",
                }}
            >
                {title}
            </h1>

            {/* Right: profile or custom */}
            <div style={{ width: 40, display: "flex", justifyContent: "flex-end" }}>
                {rightAction ?? (
                    status === "loading" ? (
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0e8e0", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                    ) : session ? (
                        <Link href="/profile">
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    color: "#4B2B1F",
                                    fontSize: 16,
                                    textTransform: "uppercase",
                                }}
                            >
                                {session.user?.name?.[0] || <User size={18} color="#4B2B1F" />}
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login" style={{ textDecoration: "none" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#4B2B1F", whiteSpace: "nowrap" }}>
                                Login
                            </span>
                        </Link>
                    )
                )}
            </div>
        </header>
    );
}
