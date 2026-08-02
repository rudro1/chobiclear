"use client";

import { useState, useCallback, useRef } from "react";
import { removeBackground } from "@imgly/background-removal";

interface UploaderProps {
  onResult: (blob: Blob, originalName: string) => void;
  onLoading: (loading: boolean, progress?: number) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function Uploader({ onResult, onLoading }: UploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Please upload a JPG, PNG, or WebP image.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Image must be smaller than 10 MB.");
        return;
      }

      onLoading(true, 0);

      try {
        const resultBlob = await removeBackground(file, {
          progress: (key: string, current: number, total: number) => {
            const pct = total > 0 ? Math.round((current / total) * 100) : 0;
            onLoading(true, pct);
          },
          // Use the CDN-hosted WASM/ONNX assets — no config needed
          publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/",
        });

        onLoading(false, 100);
        onResult(resultBlob, file.name.replace(/\.[^.]+$/, "") + "_nobg.png");
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Background removal failed.";
        setError("⚠️ " + msg + " — try a different image or browser.");
        onLoading(false);
      }
    },
    [onResult, onLoading]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  return (
    <div style={{ width: "100%", maxWidth: 640, margin: "0 auto" }}>
      <div
        className={`upload-zone${isDragging ? " dragging" : ""}`}
        id="upload-dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        aria-label="Upload image to remove background"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <div className="upload-icon">📤</div>
        <p className="upload-title">
          {isDragging ? "Drop your image here!" : "Drag & drop or click to upload"}
        </p>
        <p className="upload-sub">
          JPG, PNG, WebP · Max 10 MB · Processed in your browser 🔒
        </p>
        <button
          className="btn btn-primary"
          id="upload-btn"
          type="button"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          Choose Image
        </button>
        <input
          ref={inputRef}
          type="file"
          id="file-input"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div
          id="upload-error"
          style={{
            marginTop: 14,
            padding: "12px 18px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 10,
            color: "#dc2626",
            fontSize: "0.875rem",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
