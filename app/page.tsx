import BottomNav from "@/components/BottomNav";
import Slideshow from "@/components/Slideshow";
import EventCard from "@/components/EventCard";
import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import NotificationBell from "@/components/NotificationBell";

const sadhnaItems = [
  { label: "Japa", href: "/japa", emoji: "📿" },
  { label: "Courses", href: "/courses", emoji: "📚" },
  { label: "Audio", href: "/kirtan", emoji: "🎵" },
  { label: "Video", href: "/videos", emoji: "📹" },
  { label: "Reading", href: "/reading", emoji: "📖" },
];

export default async function HomePage() {
  const slides = await prisma.slide.findMany({ orderBy: { order: "asc" } });
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    take: 3,
  });

  return (
    <div className="app-container">
      {/* Top Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #4B2B1F 0%, #7B452F 100%)",
          padding: "48px 16px 20px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <p style={{ color: "rgba(255,230,200,0.8)", fontSize: 12, fontWeight: 500, marginBottom: 2 }}>
              Hare Krishna 🙏
            </p>
            <h1
              style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: 22,
                fontWeight: 600,
                color: "white",
                letterSpacing: 0.3,
              }}
            >
              BPBS Spiritual App
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <NotificationBell />
            <Link href="/profile">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🙏
              </div>
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <Link href="/search">
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Search size={16} color="rgba(255,255,255,0.6)" />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 400 }}>
              Search kirtans, courses, events…
            </span>
          </div>
        </Link>
      </header>

      {/* Scrollable content */}
      <div className="pb-nav" style={{ overflowY: "auto", height: "calc(100dvh - 142px)" }}>

        {/* Slideshow */}
        <div style={{ paddingTop: 8 }}>
          <Slideshow slides={slides} />
        </div>

        {/* Quick action tiles */}
        <div style={{ padding: "16px 16px 8px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Link href="/japa" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                  borderRadius: 16,
                  padding: "18px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 28 }}>📿</span>
                <div>
                  <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 16, fontWeight: 700, color: "#4B2B1F" }}>Japa</div>
                  <div style={{ fontSize: 11, color: "rgba(75,43,31,0.7)" }}>Chant & Count</div>
                </div>
              </div>
            </Link>
            <Link href="/kirtan" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                  borderRadius: 16,
                  padding: "18px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 28 }}>🎵</span>
                <div>
                  <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 16, fontWeight: 700, color: "white" }}>Kirtan</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Listen Now</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Sadhna section */}
        <div style={{ padding: "16px 0 8px" }}>
          <div style={{ padding: "0 16px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10" }}>
              🕉️ Sadhna
            </h2>
            <Link href="/reporting" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 12, color: "#FFDA6C", fontWeight: 700 }}>See all</span>
            </Link>
          </div>
          <div
            className="scrollbar-hide"
            style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px" }}
          >
            {sadhnaItems.map((item) => (
              <Link key={item.label} href={item.href} style={{ textDecoration: "none", flexShrink: 0 }}>
                <div
                  style={{
                    background: "white",
                    border: "1.5px solid #FFE0CC",
                    borderRadius: 14,
                    padding: "12px 18px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 80,
                    boxShadow: "0 2px 12px rgba(75,43,31,0.06)",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{item.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#4B2B1F" }}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Donation Banner */}
        <div style={{ padding: "12px 16px" }}>
          <Link href="/donate" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #4B2B1F 0%, #7B452F 100%)",
                borderRadius: 18,
                padding: "20px 20px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Decorative element */}
              <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,218,108,0.15)" }} />
              <div style={{ position: "absolute", right: 40, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,179,142,0.1)" }} />
              <div>
                <p style={{ color: "#FFDA6C", fontSize: 12, fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>
                  🪔 SEVA OPPORTUNITY
                </p>
                <h3
                  style={{
                    fontFamily: "'Crimson Text', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 6,
                  }}
                >
                  Support Temple Seva
                </h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                  Your donation helps devotees
                </p>
              </div>
              <div
                style={{
                  background: "linear-gradient(135deg, #FFB38E, #FFDA6C)",
                  borderRadius: 999,
                  padding: "10px 18px",
                  color: "#4B2B1F",
                  fontWeight: 800,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Donate 🙏
              </div>
            </div>
          </Link>
        </div>

        {/* Events Section */}
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 20, fontWeight: 600, color: "#2D1B10" }}>
              📅 Upcoming Events
            </h2>
            <Link href="/events" style={{ fontSize: 12, color: "#FFB38E", fontWeight: 600, textDecoration: "none" }}>
              See all
            </Link>
          </div>
          {events.length === 0 ? (
            <p style={{ color: "rgba(0,0,0,0.5)", fontSize: 13 }}>No upcoming events currently.</p>
          ) : (
            events.map((event: any) => <EventCard key={event.id} event={event} />)
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
