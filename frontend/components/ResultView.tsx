"use client";

import { useEffect, useRef, useState } from "react";

interface ResultViewProps {
  blob: Blob;
  fileName: string;
  onReset: () => void;
}

export default function ResultView({ blob, fileName, onReset }: ResultViewProps) {
  const [objectUrl, setObjectUrl] = useState<string>("");
  const dlRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  const handleDownload = () => {
    if (!objectUrl) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    a.click();
  };

  if (!objectUrl) return null;

  return (
    <div className="result-container" id="result-view">
      {/* Checkerboard preview */}
      <div className="result-image-wrapper checkerboard" style={{ marginBottom: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={objectUrl}
          alt="Background removed result"
          id="result-image"
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      </div>

      {/* Success */}
      <p style={{ textAlign: "center", color: "var(--primary)", fontWeight: 600, marginBottom: 4, fontSize: "0.95rem" }}>
        ✅ Background removed successfully!
      </p>
      <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.83rem", marginBottom: 20 }}>
        Full-quality transparent PNG · processed privately in your browser 🔒
      </p>

      {/* Download */}
      <div className="download-group">
        <button
          id="free-download-btn"
          className="btn btn-primary btn-lg"
          onClick={handleDownload}
        >
          ⬇️ Download PNG (Free)
        </button>
        <a
          href="#pricing"
          id="hd-plan-btn"
          className="btn btn-accent btn-lg"
          onClick={onReset}
        >
          ✨ Get HD Bulk Plan
        </a>
      </div>

      {/* Reset */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button id="new-image-btn" className="btn btn-ghost btn-sm" onClick={onReset}>
          ↩ Remove another image
        </button>
      </div>

      {/* Hidden anchor for programmatic download */}
      <a ref={dlRef} style={{ display: "none" }} />
    </div>
  );
}
