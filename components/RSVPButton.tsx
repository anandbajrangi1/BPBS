"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, CheckCircle } from "lucide-react";

interface RSVPButtonProps {
    eventId: string;
}

export default function RSVPButton({ eventId }: RSVPButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [status, setStatus] = useState<{ isAttending: boolean, attendeeCount: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, [eventId]);

    const fetchStatus = async () => {
        try {
            const res = await fetch(`/api/events/${eventId}/rsvp`);
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
            }
        } catch (err) {
            console.error("Failed to fetch RSVP status", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRSVP = async () => {
        if (!session) {
            router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname));
            return;
        }

        setActionLoading(true);
        try {
            const method = status?.isAttending ? "DELETE" : "POST";
            const res = await fetch(`/api/events/${eventId}/rsvp`, { method });

            if (res.ok) {
                await fetchStatus();
            }
        } catch (err) {
            console.error("RSVP Action failed", err);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#999', fontSize: 14 }}>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: 10 }}>
            {/* Real-time attendee count display */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                    padding: "12px 14px",
                    background: "#FFF8F0",
                    borderRadius: 12,
                }}
            >
                <Users size={18} color="#FFB38E" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 14, color: "#4B2B1F", fontWeight: 600, lineHeight: 1.4 }}>
                    {status?.attendeeCount || 0} devotees attending
                </span>
            </div>

            <button
                onClick={handleRSVP}
                disabled={actionLoading}
                className={status?.isAttending ? "btn-secondary" : "btn-primary"}
                style={{
                    width: "100%",
                    padding: 15,
                    fontSize: 17,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: status?.isAttending ? "#f0f0f0" : undefined,
                    color: status?.isAttending ? "#666" : undefined,
                    border: status?.isAttending ? "1px solid #ddd" : undefined,
                    opacity: actionLoading ? 0.7 : 1,
                    cursor: actionLoading ? "not-allowed" : "pointer"
                }}
            >
                {actionLoading ? (
                    "Processing..."
                ) : status?.isAttending ? (
                    <>
                        <CheckCircle size={20} /> You are attending
                    </>
                ) : (
                    "🙏 RSVP for this Event"
                )}
            </button>

            {status?.isAttending && (
                <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 10 }}>
                    Click button again to cancel your RSVP
                </p>
            )}
        </div>
    );
}
