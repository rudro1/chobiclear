"use client";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

// Replace YOUR_ADSENSE_CLIENT_ID with your actual ca-pub-XXXXXXXXXXXXXXXX
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-XXXXXXXXXXXXXXXX";

export default function AdBanner({ slot, format = "auto", className = "", style }: AdBannerProps) {
  return (
    <div
      className={className}
      style={{
        textAlign: "center",
        padding: "12px 0",
        minHeight: 90,
        background: "var(--bg-muted)",
        borderRadius: "var(--radius)",
        border: "1px dashed var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* AdSense renders into the ins tag automatically once loaded */}
    </div>
  );
}
