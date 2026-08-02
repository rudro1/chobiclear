"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PLANS = [
  {
    key: "pack_100",
    name: "100 Image Pack",
    price: "৳199",
    desc: "100 HD downloads · Credits never expire",
    highlight: false,
  },
  {
    key: "monthly",
    name: "Monthly Unlimited",
    price: "৳299/mo",
    desc: "Unlimited images · No watermark · Priority",
    highlight: true,
  },
];

interface PaymentModalProps {
  onClose: () => void;
}

export default function PaymentModal({ onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async (planKey: string) => {
    setLoading(true);
    setError(null);

    // For demo, use a guest user_id. In production, use actual auth.
    const userId = "guest_" + Math.random().toString(36).slice(2, 10);

    try {
      const formData = new FormData();
      formData.append("plan", planKey);
      formData.append("user_id", userId);

      const res = await fetch(`${API_URL}/payment/initiate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Payment initiation failed.");
      }

      const data = await res.json();

      if (data.gateway_url) {
        // Redirect to SSLCommerz payment page
        window.location.href = data.gateway_url;
      } else {
        throw new Error("No payment URL received.");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div
      id="payment-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        id="payment-modal"
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "36px 28px",
          maxWidth: 520,
          width: "100%",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          id="modal-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "var(--bg-muted)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 6, fontFamily: "var(--font)" }}>
          Upgrade for HD Downloads
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: 24 }}>
          No watermark · Full resolution · Pay with bKash, Nagad, Rocket, or card
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              style={{
                border: `2px solid ${plan.highlight ? "var(--primary)" : "var(--border)"}`,
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: plan.highlight ? "rgba(0,201,167,0.04)" : "#fff",
              }}
            >
              <div>
                {plan.highlight && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    🔥 Best Value
                  </span>
                )}
                <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 2 }}>{plan.name}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{plan.desc}</p>
              </div>
              <button
                id={`pay-${plan.key}`}
                className={`btn ${plan.highlight ? "btn-primary" : "btn-outline"}`}
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                disabled={loading}
                onClick={() => handleBuy(plan.key)}
              >
                {loading ? "..." : plan.price}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p style={{ marginTop: 16, color: "#dc2626", fontSize: "0.85rem", textAlign: "center" }}>
            ⚠️ {error}
          </p>
        )}

        <p style={{ marginTop: 20, fontSize: "0.78rem", color: "var(--text-light)", textAlign: "center" }}>
          🔒 Secure payment via SSLCommerz · bKash · Nagad · Rocket · Visa · Mastercard
        </p>
      </div>
    </div>
  );
}
