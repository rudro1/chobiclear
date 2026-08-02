"use client";

import Image from "next/image";

interface ResultViewProps {
  resultId: string;
  previewUrl: string;
  onReset: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ResultView({ resultId, previewUrl, onReset }: ResultViewProps) {
  const handleHDDownload = () => {
    const token = localStorage.getItem("cc_token");
    if (!token) {
      // Redirect to pricing / show a modal in production
      alert(
        "HD download is available for paid users.\nPurchase a plan to get full-resolution downloads without watermarks!"
      );
      return;
    }
    // Authenticated HD download
    const link = document.createElement("a");
    link.href = `${API_URL}/download/${resultId}/hd`;
    link.setAttribute("download", `chobiclear_hd_${resultId.slice(0, 8)}.png`);
    // Include the Bearer token via a fetch blob approach
    fetch(link.href, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => alert("Download failed. Please try again."));
  };

  return (
    <div className="result-container" id="result-view">
      {/* Result image */}
      <div
        className="result-image-wrapper checkerboard"
        style={{ marginBottom: 24 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Background removed result"
          id="result-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {/* Success message */}
      <p
        style={{
          textAlign: "center",
          color: "var(--primary)",
          fontWeight: 600,
          marginBottom: 4,
          fontSize: "0.95rem",
        }}
      >
        ✅ Background removed successfully!
      </p>
      <p
        style={{
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.83rem",
          marginBottom: 20,
        }}
      >
        Preview shows watermark · HD download is clean & full resolution
      </p>

      {/* Download buttons */}
      <div className="download-group">
        <a
          id="free-download-btn"
          href={previewUrl}
          download={`chobiclear_free_${resultId.slice(0, 8)}.png`}
          className="btn btn-outline btn-lg"
        >
          🖼 Free Download (watermarked)
        </a>

        <button
          id="hd-download-btn"
          className="btn btn-accent btn-lg"
          onClick={handleHDDownload}
        >
          ✨ HD Download (paid)
        </button>
      </div>

      {/* Reset */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          id="new-image-btn"
          className="btn btn-ghost btn-sm"
          onClick={onReset}
        >
          ↩ Try another image
        </button>
      </div>
    </div>
  );
}
