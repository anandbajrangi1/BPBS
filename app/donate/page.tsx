"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Script from "next/script";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Check } from "lucide-react";

const AMOUNTS = [100, 251, 501, 1001, 2501, 5001];
const PURPOSES = ["General Donation", "Temple Construction", "Food for Devotees", "Nitya Seva", "Janmashtami Fund"];

export default function DonatePage() {
    const [selected, setSelected] = useState<number | null>(501);
    const [custom, setCustom] = useState("");
    const [purpose, setPurpose] = useState("General Donation");
    const [donated, setDonated] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: session } = useSession();

    const amount = custom ? Number(custom) : selected ?? 0;

    const handleCheckout = async () => {
        if (amount < 1) return;
        setIsProcessing(true);

        try {
            // 1. Create order
            const res = await fetch("/api/donations/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, purpose })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // 2. Initialize Razorpay Checkout
            const options = {
                key: data.key, // Key returned from backend
                amount: data.amount,
                currency: data.currency,
                name: "BPBS Trust",
                description: `Seva: ${purpose}`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    // 3. Verify payment signature
                    const verifyRes = await fetch("/api/donations/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        setDonated(true);
                    } else {
                        alert("Payment verification failed! If money was deducted, please contact support.");
                    }
                },
                prefill: {
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                    contact: (session?.user as any)?.phone || "",
                },
                theme: {
                    color: "#FFB38E"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                console.error("Payment failed", response.error);
                alert(`Payment failed: ${response.error.description}`);
            });
            rzp.open();
        } catch (error: any) {
            console.error("Donation initialization failed:", error);
            alert("Could not start payment. Please check your connection and try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (donated) {
        return (
            <div className="app-container">
                <div
                    style={{
                        minHeight: "100dvh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 32,
                        background: "linear-gradient(160deg, #4B2B1F 0%, #FFB38E 100%)",
                    }}
                >
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #FFDA6C, #FFB38E)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 48,
                            marginBottom: 24,
                            boxShadow: "0 12px 40px rgba(255,218,108,0.4)",
                        }}
                    >
                        🙏
                    </div>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 32, fontWeight: 700, color: "white", marginBottom: 8, textAlign: "center" }}>
                        Hare Krishna!
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 6, textAlign: "center" }}>
                        Thank you for your donation of
                    </p>
                    <div style={{ fontFamily: "'Crimson Text', serif", fontSize: 40, fontWeight: 700, color: "#FFDA6C", marginBottom: 8 }}>
                        ₹{amount.toLocaleString()}
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 32, textAlign: "center", fontSize: 14 }}>
                        Your seva towards {purpose} has been received. 🩷
                    </p>
                    <button
                        onClick={() => { setDonated(false); setCustom(""); setSelected(501); }}
                        style={{
                            background: "white",
                            color: "#4B2B1F",
                            fontWeight: 800,
                            fontSize: 16,
                            border: "none",
                            borderRadius: 999,
                            padding: "14px 32px",
                            cursor: "pointer",
                            fontFamily: "'Nunito', sans-serif",
                        }}
                    >
                        Donate Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <Header title="Make a Donation" />
            <div className="pb-nav" style={{ overflowY: "auto" }}>
                {/* Hero */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #4B2B1F, #7B452F)",
                        padding: "24px 20px",
                        textAlign: "center",
                    }}
                >
                    <p style={{ fontSize: 40, marginBottom: 8 }}>🪔</p>
                    <h2 style={{ fontFamily: "'Crimson Text', serif", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 6 }}>
                        Offer Your Seva
                    </h2>
                    <p style={{ color: "rgba(255,230,200,0.75)", fontSize: 13, lineHeight: 1.5 }}>
                        Your donation helps maintain the temple, feed devotees, and spread spiritual knowledge.
                    </p>
                </div>

                <div style={{ padding: "20px 16px" }}>
                    {/* Purpose */}
                    <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", marginBottom: 12 }}>
                            Seva Purpose
                        </h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {PURPOSES.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPurpose(p)}
                                    style={{
                                        border: "1.5px solid",
                                        borderColor: purpose === p ? "#FFB38E" : "#e0d4cc",
                                        borderRadius: 999,
                                        padding: "7px 14px",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: purpose === p ? "#4B2B1F" : "#888",
                                        background: purpose === p ? "#FFF3EC" : "white",
                                        cursor: "pointer",
                                        fontFamily: "'Nunito', sans-serif",
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amount selection */}
                    <div style={{ marginBottom: 20 }}>
                        <h3 style={{ fontFamily: "'Crimson Text', serif", fontSize: 18, fontWeight: 600, color: "#2D1B10", marginBottom: 12 }}>
                            Select Amount
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                            {AMOUNTS.map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => { setSelected(amt); setCustom(""); }}
                                    style={{
                                        background: selected === amt && !custom ? "linear-gradient(135deg, #FFB38E, #FFDA6C)" : "white",
                                        border: "1.5px solid",
                                        borderColor: selected === amt && !custom ? "#FFB38E" : "#e0d4cc",
                                        borderRadius: 12,
                                        padding: "12px 8px",
                                        fontWeight: 800,
                                        fontSize: 15,
                                        color: selected === amt && !custom ? "#4B2B1F" : "#666",
                                        cursor: "pointer",
                                        fontFamily: "'Nunito', sans-serif",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                    }}
                                >
                                    {selected === amt && !custom && <Check size={12} />}
                                    ₹{amt.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {/* Custom amount */}
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>
                                CUSTOM AMOUNT
                            </label>
                            <div style={{ position: "relative" }}>
                                <span
                                    style={{
                                        position: "absolute",
                                        left: 16,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: "#4B2B1F",
                                    }}
                                >₹</span>
                                <input
                                    type="number"
                                    value={custom}
                                    onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                                    placeholder="Enter amount"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px 12px 32px",
                                        border: "1.5px solid #FFE0CC",
                                        borderRadius: 12,
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: "#2D1B10",
                                        boxSizing: "border-box",
                                        fontFamily: "'Nunito', sans-serif",
                                        background: "#FEFAF6",
                                        outline: "none",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div
                        style={{
                            background: "#FFF8F0",
                            border: "1.5px solid #FFE0CC",
                            borderRadius: 14,
                            padding: "14px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 20,
                        }}
                    >
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#4B2B1F" }}>Total Donation</span>
                        <span style={{ fontFamily: "'Crimson Text', serif", fontSize: 28, fontWeight: 700, color: "#FFB38E" }}>
                            ₹{amount.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing || amount < 1}
                        className="btn-primary"
                        style={{
                            width: "100%",
                            padding: 15,
                            fontSize: 17,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            opacity: (isProcessing || amount < 1) ? 0.5 : 1,
                            cursor: (isProcessing || amount < 1) ? "not-allowed" : "pointer",
                        }}
                    >
                        {isProcessing ? "Processing..." : `🙏 Proceed to Pay ₹${amount.toLocaleString()}`}
                    </button>
                    <p style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#999" }}>
                        Secure payment via UPI, Card, Net Banking
                    </p>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
