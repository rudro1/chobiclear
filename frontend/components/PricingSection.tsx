const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "৳0",
    desc: "Try it out — no signup",
    popular: false,
    cta: "Start Free",
    ctaHref: "#upload",
    ctaClass: "btn-outline",
    features: [
      { text: "Up to 10 images/day", ok: true },
      { text: "Watermarked download", ok: true },
      { text: "Max 1200px output", ok: true },
      { text: "HD clean download", ok: false },
      { text: "Priority processing", ok: false },
    ],
  },
  {
    id: "pack",
    name: "100 Image Pack",
    price: "৳199",
    desc: "One-time purchase · 100 credits",
    popular: false,
    cta: "Buy Pack",
    ctaHref: "#pricing",
    ctaClass: "btn-accent",
    features: [
      { text: "100 HD downloads", ok: true },
      { text: "No watermark", ok: true },
      { text: "Full resolution output", ok: true },
      { text: "Credits never expire", ok: true },
      { text: "Priority processing", ok: false },
    ],
  },
  {
    id: "monthly",
    name: "Monthly Unlimited",
    price: "৳299",
    desc: "Per month · billed monthly",
    popular: true,
    cta: "Go Unlimited",
    ctaHref: "#pricing",
    ctaClass: "btn-primary",
    features: [
      { text: "Unlimited images/month", ok: true },
      { text: "No watermark", ok: true },
      { text: "Full resolution output", ok: true },
      { text: "Priority processing", ok: true },
      { text: "bKash · Nagad · Card", ok: true },
    ],
  },
];

export default function PricingSection({ onBuyClick }: { onBuyClick?: () => void }) {
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-heading">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-accent" style={{ marginBottom: 12 }}>Pricing</span>
          <h2 id="pricing-heading">Simple, Transparent Pricing</h2>
          <p>
            Pay with bKash, Nagad, Rocket, or card. No hidden fees.
            <br />
            <span style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>
              বাংলাদেশের জন্য বিশেষভাবে তৈরি
            </span>
          </p>
        </div>

        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              id={`pricing-${plan.id}`}
              className={`pricing-card${plan.popular ? " popular" : ""}`}
            >
              {plan.popular && (
                <div className="popular-badge">🔥 Most Popular</div>
              )}

              <p className="pricing-name">{plan.name}</p>
              <p className="pricing-price">{plan.price}</p>
              <p className="pricing-desc">{plan.desc}</p>

              <ul className="pricing-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <span className={f.ok ? "feat-check" : "feat-x"}>
                      {f.ok ? "✓" : "✕"}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              {plan.id === "free" ? (
                <a
                  href={plan.ctaHref}
                  className={`btn ${plan.ctaClass}`}
                  style={{ width: "100%", display: "flex" }}
                  id={`pricing-cta-${plan.id}`}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  className={`btn ${plan.ctaClass}`}
                  style={{ width: "100%", display: "flex" }}
                  id={`pricing-cta-${plan.id}`}
                  onClick={onBuyClick}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: "0.82rem",
            color: "var(--text-light)",
          }}
        >
          🔒 Secure payments via SSLCommerz · bKash · Nagad · Rocket · Visa · Mastercard
        </p>
      </div>
    </section>
  );
}
