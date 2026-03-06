"use client";
import { useState, useEffect } from "react";
import { Search, Shield, ShieldOff, Edit, ShieldCheck } from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) setUsers(await res.json());
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(query.toLowerCase()) ||
            u.email?.toLowerCase().includes(query.toLowerCase()) ||
            u.phone?.includes(query)
    );

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";

        // Optimistic UI update
        setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u));

        try {
            const res = await fetch(`/api/users?id=${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error("Status update failed");
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
            // Revert on failure
            setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: currentStatus } : u));
        }
    };

    return (
        <div>
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0" }}>
                <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>
                    User Management
                </h1>
                <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{users.length} total users</p>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {/* Search */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: "white",
                        border: "1.5px solid #FFE0CC",
                        borderRadius: 12,
                        padding: "10px 16px",
                        marginBottom: 20,
                        maxWidth: 360,
                    }}
                >
                    <Search size={16} color="#FFB38E" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search users…"
                        style={{ border: "none", outline: "none", fontSize: 14, fontFamily: "'Nunito', sans-serif", width: "100%" }}
                    />
                </div>

                {/* Table */}
                <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(75,43,31,0.07)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#FFF8F0" }}>
                                {["User", "Phone", "Email", "Japa Rounds", "Donations", "Status", "Actions"].map((h) => (
                                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                                        {h.toUpperCase()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                                        No users found.
                                    </td>
                                </tr>
                            ) : filtered.map((user, i) => (
                                <tr
                                    key={user.id}
                                    style={{ borderTop: "1px solid #f7f0ea", background: i % 2 === 0 ? "white" : "#FEFAF6" }}
                                >
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                                                🙏
                                            </div>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#2D1B10" }}>{user.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#666" }}>{user.phone}</td>
                                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#666" }}>{user.email}</td>
                                    <td style={{ padding: "14px 16px", fontFamily: "'Crimson Text', serif", fontSize: 16, fontWeight: 700, color: "#4B2B1F" }}>
                                        {user.japaRounds.toLocaleString()}
                                    </td>
                                    <td style={{ padding: "14px 16px", fontFamily: "'Crimson Text', serif", fontSize: 16, fontWeight: 700, color: "#FFB38E" }}>
                                        ₹{user.totalDonation.toLocaleString()}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 800,
                                                padding: "4px 10px",
                                                borderRadius: 999,
                                                background: user.status === "ACTIVE" ? "#c8f5c8" : "#fee2e2",
                                                color: user.status === "ACTIVE" ? "#2a7a2a" : "#dc2626",
                                            }}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button
                                                onClick={() => toggleStatus(user.id, user.status)}
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 8,
                                                    border: "none",
                                                    background: user.status === "ACTIVE" ? "#fee2e2" : "#dcfce7",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                title={user.status === "ACTIVE" ? "Block" : "Activate"}
                                            >
                                                {user.status === "ACTIVE" ? <ShieldOff size={14} color="#dc2626" /> : <ShieldCheck size={14} color="#16a34a" />}
                                            </button>
                                            <button
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 8,
                                                    border: "none",
                                                    background: "#FFF3EC",
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                title="Edit"
                                            >
                                                <Edit size={14} color="#FFB38E" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
