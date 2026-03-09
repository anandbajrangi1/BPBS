"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Users } from "lucide-react";

type Event = {
    id: string;
    title: string;
    date: string | Date;
    location: string;
    venue: string;
    description: string;
    category: string;
    image?: string;
    rsvp?: boolean;
    attendees?: number;
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Event | null>(null);
    const [form, setForm] = useState({ title: "", date: "", location: "", venue: "", description: "", category: "Festival" });
    const [isLoading, setIsLoading] = useState(true);

    const [attendees, setAttendees] = useState<any[]>([]);
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [loadingAttendees, setLoadingAttendees] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events");
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (err) {
            console.error("Failed to fetch events", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAttendees = async (event: Event) => {
        setSelectedEvent(event);
        setLoadingAttendees(true);
        setShowAttendeesModal(true);
        try {
            const res = await fetch(`/api/events/${event.id}/attendees`);
            if (res.ok) {
                const data = await res.json();
                setAttendees(data);
            }
        } catch (err) {
            console.error("Failed to fetch attendees", err);
        } finally {
            setLoadingAttendees(false);
        }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ title: "", date: "", location: "", venue: "", description: "", category: "Festival" });
        setShowModal(true);
    };

    const openEdit = (event: Event) => {
        setEditing(event);
        setForm({
            title: event.title,
            date: new Date(event.date).toISOString().split('T')[0],
            location: event.location,
            venue: event.venue,
            description: event.description,
            category: event.category
        });
        setShowModal(true);
    };

    const save = async () => {
        try {
            const payload = {
                ...form,
                date: new Date(form.date).toISOString()
            };

            if (editing) {
                const res = await fetch(`/api/events/${editing.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (res.ok) fetchEvents();
            } else {
                const res = await fetch("/api/events", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (res.ok) fetchEvents();
            }
            setShowModal(false);
        } catch (err) {
            console.error("Failed to save event", err);
            alert("Failed to save event");
        }
    };

    const remove = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
            if (res.ok) fetchEvents();
        } catch (err) {
            console.error("Failed to delete event", err);
        }
    };

    return (
        <div>
            <div style={{ background: "white", padding: "20px 32px", borderBottom: "1px solid #f0e8e0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#2D1B10" }}>Event Management</h1>
                    <p style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{events.length} events total</p>
                </div>
                <button
                    onClick={openCreate}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                        border: "none",
                        borderRadius: 12,
                        padding: "11px 20px",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#4B2B1F",
                        cursor: "pointer",
                        fontFamily: "'Nunito', sans-serif",
                    }}
                >
                    <Plus size={16} /> Create Event
                </button>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {isLoading ? (
                    <p style={{ color: "#888", textAlign: "center", marginTop: 40 }}>Loading events...</p>
                ) : events.length === 0 ? (
                    <p style={{ color: "#888", textAlign: "center", marginTop: 40 }}>No events found. Create one above.</p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                        {events.map((event) => (
                            <div
                                key={event.id}
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    boxShadow: "0 2px 16px rgba(75,43,31,0.07)",
                                }}
                            >
                                <div style={{ background: "linear-gradient(135deg, #FFB38E, #FFDA6C)", height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
                                    {event.category === "Festival" ? "🪔" : event.category === "Camp" ? "⛺" : "📿"}
                                </div>
                                <div style={{ padding: "14px 16px" }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#4B2B1F", background: "#FFB38E", padding: "2px 8px", borderRadius: 999 }}>
                                        {event.category}
                                    </span>
                                    <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 17, fontWeight: 600, color: "#2D1B10", margin: "8px 0 4px" }}>
                                        {event.title}
                                    </h3>
                                    <p style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>📅 {new Date(event.date).toLocaleDateString("en-IN")}</p>
                                    <p style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>📍 {event.location}</p>

                                    <div style={{ background: "#FEFAF6", border: "1px solid #FFE0CC", borderRadius: 10, padding: "8px 12px", marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Users size={14} color="#FFB38E" />
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "#4B2B1F" }}>{event.attendees || 0}</span>
                                        </div>
                                        <button
                                            onClick={() => fetchAttendees(event)}
                                            style={{ background: 'none', border: 'none', color: '#FFB38E', fontSize: 11, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            View List
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            onClick={() => openEdit(event)}
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: 6,
                                                background: "#FFF3EC",
                                                border: "1.5px solid #FFE0CC",
                                                borderRadius: 10,
                                                padding: "8px",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                color: "#4B2B1F",
                                                cursor: "pointer",
                                                fontFamily: "'Nunito', sans-serif",
                                            }}
                                        >
                                            <Pencil size={13} /> Edit
                                        </button>
                                        <button
                                            onClick={() => remove(event.id)}
                                            style={{
                                                width: 36,
                                                height: 36,
                                                background: "#fee2e2",
                                                border: "none",
                                                borderRadius: 10,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <Trash2 size={14} color="#dc2626" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                        padding: 20,
                    }}
                    onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
                >
                    <div style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 700, color: "#2D1B10" }}>
                                {editing ? "Edit Event" : "Create Event"}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                                <X size={20} color="#888" />
                            </button>
                        </div>

                        {(["title", "date", "location", "venue", "description"] as const).map((field) => (
                            <div key={field} style={{ marginBottom: 14 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>
                                    {field.toUpperCase()}
                                </label>
                                {field === "description" ? (
                                    <textarea
                                        value={form[field] as string}
                                        onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                                        rows={3}
                                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #FFE0CC", borderRadius: 10, fontSize: 14, fontFamily: "'Nunito', sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                                    />
                                ) : (
                                    <input
                                        type={field === "date" ? "date" : "text"}
                                        value={form[field] as string}
                                        onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                                        style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #FFE0CC", borderRadius: 10, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", boxSizing: "border-box" }}
                                    />
                                )}
                            </div>
                        ))}

                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>CATEGORY</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #FFE0CC", borderRadius: 10, fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none" }}
                            >
                                {["Festival", "Camp", "Class"].map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        <button
                            onClick={save}
                            style={{
                                width: "100%",
                                padding: 13,
                                background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                                border: "none",
                                borderRadius: 12,
                                fontWeight: 700,
                                fontSize: 15,
                                color: "#4B2B1F",
                                cursor: "pointer",
                                fontFamily: "'Nunito', sans-serif",
                            }}
                        >
                            {editing ? "Save Changes" : "Create Event"}
                        </button>
                    </div>
                </div>
            )
            }

            {showAttendeesModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                        padding: 20,
                    }}
                    onClick={(e) => e.target === e.currentTarget && setShowAttendeesModal(false)}
                >
                    <div style={{ background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <div>
                                <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 700, color: "#2D1B10" }}>
                                    Attendees List
                                </h2>
                                <p style={{ fontSize: 13, color: "#888" }}>{selectedEvent?.title}</p>
                            </div>
                            <button onClick={() => setShowAttendeesModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                                <X size={20} color="#888" />
                            </button>
                        </div>

                        {loadingAttendees ? (
                            <p style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>Loading devotees list...</p>
                        ) : attendees.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <p style={{ color: '#888', marginBottom: 4 }}>No devotees have RSVP'd yet.</p>
                                <p style={{ fontSize: 12, color: '#999' }}>Users will appear here as they click 'RSVP'</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {attendees.map((a: any) => (
                                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', borderRadius: 12, background: '#FEFAF6', border: '1px solid #FFE0CC' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 20, background: '#FFB38E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 18 }}>
                                            {a.name?.[0] || a.username?.[0] || "?"}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 14, fontWeight: 700, color: '#2D1B10' }}>{a.name || a.username}</p>
                                            <p style={{ fontSize: 12, color: '#666' }}>{a.phone || "No phone provided"}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: 10, color: '#999' }}>Joined on</p>
                                            <p style={{ fontSize: 11, fontWeight: 600, color: '#4B2B1F' }}>{new Date(a.rsvpDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowAttendeesModal(false)}
                            style={{
                                width: "100%",
                                padding: 13,
                                background: "#4B2B1F",
                                border: "none",
                                borderRadius: 12,
                                fontWeight: 700,
                                fontSize: 15,
                                color: "white",
                                cursor: "pointer",
                                marginTop: 24,
                                fontFamily: "'Nunito', sans-serif",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
}
