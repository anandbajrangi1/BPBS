"use client";
import { Bell } from "lucide-react";

export default function NotificationBell() {
    return (
        <button
            onClick={() => alert("🔔 Notifications coming soon! Hare Krishna!")}
            style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}
        >
            <Bell size={18} color="white" />
        </button>
    );
}
