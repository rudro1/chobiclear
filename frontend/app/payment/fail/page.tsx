import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Failed – ChobiClear",
  description: "Your payment could not be processed. Please try again.",
  robots: { index: false, follow: false },
};

export default function PaymentFail() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--font)", background: "var(--bg)" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>😕</div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>
          Payment Failed
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
          Your payment could not be processed. No charge was made. Please try again or use a different payment method.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/#pricing" className="btn btn-primary btn-lg" style={{ display: "inline-flex" }}>
            Try Again
          </Link>
          <Link href="/" className="btn btn-ghost btn-lg" style={{ display: "inline-flex" }}>
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
