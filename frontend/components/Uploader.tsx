"use client";

import { useState, useCallback, useRef } from "react";

interface UploaderProps {
  onResult: (resultId: string, previewUrl: string) => void;
  onLoading: (loading: boolean) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
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

      onLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("cc_token");
        const headers: HeadersInit = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/remove-bg`, {
          method: "POST",
          headers,
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Background removal failed.");
        }

        const data = await res.json();

        // Build a preview URL for the free download (watermarked)
        const previewUrl = `${API_URL}/download/${data.result_id}`;
        onResult(data.result_id, previewUrl);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Something went wrong.";
        setError(msg);
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
    e.target.value = ""; // allow re-uploading same file
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
          JPG, PNG, WebP · Max 10 MB
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
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
