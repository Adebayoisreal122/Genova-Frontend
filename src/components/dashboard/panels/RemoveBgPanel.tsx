"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Scissors, Sparkles, X } from "lucide-react";
import { api } from "@/lib/api";
import { TONES } from "../config";
import { downloadImage } from "../download";
import { DropZone, ErrorNote, FieldLabel, InfoBanner, MetaPanel, StatusBadge, secondaryBtn } from "../ui";
import { previewUrl } from "@/lib/cloudinary";
import { toItem, type DbImage, type GalleryItem } from "../types";

export default function RemoveBgPanel({ onSaved }: { onSaved: (image: DbImage) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Object URLs are instant (no base64 round trip) and are released when no longer needed.
  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
  };

  const run = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("image", file);
      const { image } = await api<{ image: DbImage }>("/api/images/remove-bg", { method: "POST", form });
      setResult(toItem(image));
      onSaved(image);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <InfoBanner tone="emerald" icon={Sparkles} title="Background removal">
        <p>Upload a photo and get a transparent PNG back. The result is saved to your gallery automatically.</p>
      </InfoBanner>

      {!file ? (
        <DropZone onFile={(f) => { setFile(f); setResult(null); setError(""); }} />
      ) : (
        <div className="space-y-4">
          <div className={`grid gap-4 ${result ? "grid-cols-2" : "grid-cols-1"}`}>
            <div>
              <FieldLabel>Original</FieldLabel>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Original" className="h-52 w-full rounded-xl border border-white/8 bg-white/3 object-contain" />
            </div>
            {result && (
              <div>
                <FieldLabel>Result</FieldLabel>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl(result.url, 800)} alt="Background removed" className="checker h-52 w-full rounded-xl border border-white/8 object-contain" />
              </div>
            )}
          </div>

          {loading && <StatusBadge tone="emerald" text="Removing background…" />}
          {error && <ErrorNote>{error}</ErrorNote>}
          {result && <MetaPanel meta={result.meta} />}

          <div className="flex gap-3">
            <button
              onClick={run}
              disabled={loading}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-40 ${TONES.emerald.button}`}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Scissors size={15} /> {result ? "Run again" : "Remove background"}
                </>
              )}
            </button>
            {result && (
              <button onClick={() => downloadImage(result.url, "no-background")} className={secondaryBtn}>
                <Download size={14} /> Save
              </button>
            )}
            <button onClick={reset} aria-label="Start over" className={secondaryBtn}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
