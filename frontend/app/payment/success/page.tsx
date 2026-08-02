import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Successful – ChobiClear",
  description: "Your payment was successful. Your credits have been added to your ChobiClear account.",
  robots: { index: false, follow: false },
};

export default function PaymentSuccess() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--font)", background: "var(--bg)" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12, color: "var(--text)" }}>
          Payment Successful!
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
          Your credits have been added. You can now download HD backgrounds without watermarks.
        </p>
        <Link href="/" className="btn btn-primary btn-lg" style={{ display: "inline-flex" }}>
          ✨ Start Removing Backgrounds
        </Link>
      </div>
    </main>
  );
}
