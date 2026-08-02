"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Uploader from "@/components/Uploader";
import ResultView from "@/components/ResultView";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";

const HOW_STEPS = [
  {
    emoji: "📁",
    title: "Upload Your Image",
    desc: "Drag & drop or click to select a JPG, PNG, or WebP photo.",
  },
  {
    emoji: "⚡",
    title: "AI Removes Background",
    desc: "Our U²-Net deep learning model processes your image in seconds.",
  },
  {
    emoji: "⬇️",
    title: "Download Result",
    desc: "Get your transparent PNG. Free with watermark, HD for paid users.",
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);

  const handleResult = (resultId: string, previewUrl: string) => {
    setResult({ id: resultId, url: previewUrl });
    setLoading(false);
    // Smooth scroll to result
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    setLoading(false);
    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-tag">
          <span className="badge badge-primary">🇧🇩 Made for Bangladesh · সম্পূর্ণ বিনামূল্যে</span>
        </div>

        <h1 id="hero-heading">
          Free Background Remover for Photos —{" "}
          <span className="gradient-text">ছবির ব্যাকগ্রাউন্ড রিমুভ করুন ফ্রিতে</span>
        </h1>

        <p className="hero-sub">
          Upload any photo and let AI instantly erase the background. No signup, no
          install — 100% free online. Fast, accurate, private.
        </p>

        <a href="#upload" className="btn btn-primary btn-lg">
          Remove Background Free ✨
        </a>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">5s</div>
            <div className="hero-stat-label">Average processing time</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-label">Free, no signup</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">60min</div>
            <div className="hero-stat-label">Auto file deletion</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">PNG</div>
            <div className="hero-stat-label">Transparent output</div>
          </div>
        </div>
      </section>

      {/* ─── Upload / Result ───────────────────────────────────────────── */}
      <section
        id="upload"
        aria-label="Background remover tool"
        style={{ padding: "48px 20px 64px" }}
      >
        <div className="container" style={{ maxWidth: 700 }}>
          {/* Loading state */}
          {loading && (
            <div className="loading-wrapper" id="loading-indicator">
              <div className="spinner" />
              <p className="loading-title">Removing background…</p>
              <div className="loading-bar">
                <div className="loading-bar-fill" />
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                AI is analyzing your image ✨
              </p>
            </div>
          )}

          {/* Uploader */}
          {!loading && !result && (
            <Uploader onResult={handleResult} onLoading={setLoading} />
          )}

          {/* Result */}
          {!loading && result && (
            <div id="result-section">
              <ResultView
                resultId={result.id}
                previewUrl={result.url}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </section>

      {/* ─── How it works ──────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="section"
        aria-labelledby="how-heading"
        style={{ background: "var(--bg-muted)" }}
      >
        <div className="container">
          <div className="section-header">
            <span className="badge badge-primary" style={{ marginBottom: 12 }}>Simple Process</span>
            <h2 id="how-heading">How ChobiClear Works</h2>
            <p>Remove backgrounds in 3 simple steps — no technical skills needed.</p>
          </div>

          <div className="steps-grid">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="step-card" id={`step-${i + 1}`}>
                <span className="step-emoji" style={{ animationDelay: `${i * 0.5}s` }}>
                  {step.emoji}
                </span>
                <div className="step-number">{i + 1}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────────────── */}
      <PricingSection />

      {/* ─── FAQ ───────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ─── Footer ────────────────────────────────────────────────────── */}
      <footer className="footer" role="contentinfo">
        <p>
          © {new Date().getFullYear()} ChobiClear · Built with ❤️ for Bangladesh ·{" "}
          <a href="mailto:support@chobiclear.com">support@chobiclear.com</a>
        </p>
        <p style={{ marginTop: 8 }}>
          <a href="/privacy">Privacy Policy</a> ·{" "}
          <a href="/terms">Terms of Service</a>
        </p>
      </footer>
    </>
  );
}
