"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
                width: "100%",
                padding: 14,
                background: "transparent",
                border: "1.5px solid #FFB38E",
                borderRadius: 999,
                color: "#4B2B1F",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
            }}
        >
            Sign Out
        </button>
    );
}
