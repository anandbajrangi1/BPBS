"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
    id: string;
    title: string;
    subtitle: string | null;
    link: string | null;
    color: string;
}

const COLORS = ["#FFB38E", "#FFDA6C", "#E8A07A", "#F5C96B"];
const BG_PATTERNS = [
    "linear-gradient(135deg, #FFB38E 0%, #FFDA6C 100%)",
    "linear-gradient(135deg, #FFDA6C 0%, #FFB38E 100%)",
    "linear-gradient(135deg, #4B2B1F 0%, #7B452F 100%)",
];

interface SlideshowProps {
    slides: Slide[];
}

export default function Slideshow({ slides }: SlideshowProps) {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 3500);
        return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
    }, [slides.length]);

    const goTo = (idx: number) => {
        setCurrent(idx);
        if (intervalRef.current !== null) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 3500);
    };

    // Spiritual/devotional emoji icons for slides
    const icons = ["🕉️", "🪔", "🎵", "📖"];

    return (
        <div style={{ padding: "0 16px", marginBottom: 4 }}>
            <div
                style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    position: "relative",
                    height: 180,
                    boxShadow: "0 8px 32px rgba(75,43,31,0.15)",
                }}
            >
                {/* Slides */}
                {slides.map((slide, idx) => (
                    <Link
                        key={slide.id}
                        href={slide.link || "#"}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: BG_PATTERNS[idx % BG_PATTERNS.length],
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            padding: 20,
                            textDecoration: "none",
                            opacity: idx === current ? 1 : 0,
                            transition: "opacity 0.6s ease",
                            pointerEvents: idx === current ? "auto" : "none",
                        }}
                    >
                        {/* Decorative icon */}
                        <div
                            style={{
                                position: "absolute",
                                top: 16,
                                right: 20,
                                fontSize: 52,
                                opacity: 0.3,
                            }}
                        >
                            {icons[idx % icons.length]}
                        </div>
                        {/* Decorative circles */}
                        <div
                            style={{
                                position: "absolute",
                                top: -20,
                                right: -20,
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.1)",
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                top: 40,
                                right: 60,
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.1)",
                            }}
                        />
                        <span
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                fontFamily: "'Crimson Text', serif",
                                color: idx === 2 ? "white" : "#4B2B1F",
                                lineHeight: 1.2,
                                marginBottom: 4,
                            }}
                        >
                            {slide.title}
                        </span>
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: idx === 2 ? "rgba(255,255,255,0.8)" : "rgba(75,43,31,0.75)",
                            }}
                        >
                            {slide.subtitle}
                        </span>
                    </Link>
                ))}

                {/* Dots */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 12,
                        right: 16,
                        display: "flex",
                        gap: 5,
                        alignItems: "center",
                    }}
                >
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.preventDefault(); goTo(idx); }}
                            style={{
                                height: 6,
                                width: idx === current ? 20 : 6,
                                borderRadius: 3,
                                border: "none",
                                background: "rgba(255,255,255,0.8)",
                                opacity: idx === current ? 1 : 0.5,
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
