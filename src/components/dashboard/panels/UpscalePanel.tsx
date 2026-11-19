"use client";

import { useEffect, useState } from "react";
import { Check, Download, Loader2, X, ZoomIn } from "lucide-react";
import { api } from "@/lib/api";
import { fmtBytes, saveBlob } from "@/lib/format";
import { TONES } from "../config";
import { DropZone, ErrorNote, FieldLabel, InfoBanner, MetaPanel, secondaryBtn } from "../ui";
import { useToast } from "../Toast";
import type { DbImage } from "../types";

const SCALES = [1.5, 2, 3, 4];
const MAX_SIDE = 8192; // px: browsers refuse canvases much larger than this
const MAX_PIXELS = 36_000_000; // phones fail well before desktop limits
const MAX_SAVE_BYTES = 9.5 * 1_048_576; // Cloudinary's free plan accepts images up to 10 MB

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That image couldn't be read."));
    img.src = src;
  });

export default function UpscalePanel({ onSaved }: { onSaved: (image: DbImage) => void }) {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [orig, setOrig] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; blob: Blob; w: number; h: number; saved: boolean } | null>(null);

  useEffect(() => {
    if (!file) return setPreview("");
    const url = URL.createObjectURL(file);
    setPreview(url);
    loadImage(url).then((img) => setOrig({ w: img.naturalWidth, h: img.naturalHeight })).catch(() => {});
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const url = result?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [result?.url]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setOrig({ w: 0, h: 0 });
  };

  const upscale = async () => {
    if (!file) return;
    setError("");
    setResult(null);

    const w = Math.round(orig.w * scale);
    const h = Math.round(orig.h * scale);
    if (Math.max(w, h) > MAX_SIDE || w * h > MAX_PIXELS) {
      return setError(`${w} × ${h} px is too large for a browser to handle. Try a smaller scale.`);
    }

    setLoading(true);
    try {
      const img = await loadImage(preview);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser couldn't create the image.");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);

      const png = await toBlob(canvas, "image/png");
      if (!png) throw new Error("Your browser couldn't create the image. Try a smaller scale.");

      // Download gets the lossless PNG. The gallery copy falls back to high-quality WebP if the PNG is huge.
      const forGallery = png.size <= MAX_SAVE_BYTES ? png : (await toBlob(canvas, "image/webp", 0.92)) ?? png;
      canvas.width = canvas.height = 0; // release the pixel buffer

      setResult({ url: URL.createObjectURL(png), blob: png, w, h, saved: false });
      setLoading(false);

      try {
        const form = new FormData();
        form.append("image", forGallery, forGallery.type === "image/webp" ? "upscaled.webp" : "upscaled.png");
        form.append("type", "upscaled");
        form.append("width", String(w));
        form.append("height", String(h));
        const { image } = await api<{ image: DbImage }>("/api/images/save", { method: "POST", form });
        onSaved(image);
        setResult((r) => (r ? { ...r, saved: true } : r));
      } catch (err) {
        toast(`Couldn't save to your gallery (${(err as Error).message}) — you can still download it.`);
      }
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <InfoBanner tone="amber" icon={ZoomIn} title="Upscaling runs in your browser">
        <p>Free, no API key, and your image only leaves your device when it&apos;s saved to your gallery.</p>
      </InfoBanner>

      <div>
        <FieldLabel>
          Scale
          {orig.w > 0 && (
            <span className="ml-2 font-normal text-white/40">
              {orig.w}×{orig.h} → {Math.round(orig.w * scale)}×{Math.round(orig.h * scale)} px
            </span>
          )}
        </FieldLabel>
        <div className="flex gap-2" role="radiogroup" aria-label="Scale factor">
          {SCALES.map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={scale === s}
              onClick={() => setScale(s)}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition ${
                scale === s
                  ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                  : "border-white/8 bg-white/3 text-white/40 hover:border-white/15 hover:text-white/70"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {!file ? (
        <DropZone onFile={setFile} />
      ) : (
        <div className="space-y-4">
          <div className={`grid gap-4 ${result ? "grid-cols-2" : "grid-cols-1"}`}>
            <div>
              <FieldLabel>Original ({fmtBytes(file.size)})</FieldLabel>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Original" className="h-48 w-full rounded-xl border border-white/8 bg-white/3 object-contain" />
            </div>
            {result && (
              <div>
                <FieldLabel>Upscaled ({fmtBytes(result.blob.size)})</FieldLabel>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.url} alt="Upscaled" className="checker h-48 w-full rounded-xl border border-white/8 object-contain" />
              </div>
            )}
          </div>

          {error && <ErrorNote>{error}</ErrorNote>}
          {result && (
            <>
              <MetaPanel meta={{ width: result.w, height: result.h, createdAt: new Date() }} />
              <p className="flex items-center gap-1.5 text-xs text-white/40">
                {result.saved ? (
                  <>
                    <Check size={12} className="text-emerald-400" /> Saved to your gallery
                  </>
                ) : (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Saving to your gallery…
                  </>
                )}
              </p>
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={upscale}
              disabled={loading || !orig.w}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-40 ${TONES.amber.button}`}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Upscaling…
                </>
              ) : (
                <>
                  <ZoomIn size={15} /> Upscale {scale}×
                </>
              )}
            </button>
            {result && (
              <button onClick={() => saveBlob(result.blob, `upscaled-${scale}x.png`)} className={secondaryBtn}>
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
