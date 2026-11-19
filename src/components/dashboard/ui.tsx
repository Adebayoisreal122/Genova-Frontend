"use client";

import { useState } from "react";
import { Check, Copy, Download, Info, Loader2, Upload, X, type LucideIcon } from "lucide-react";
import { MAX_FILE_MB, TONES, type Tone } from "./config";
import { useToast } from "./Toast";
import { previewUrl } from "@/lib/cloudinary";
import type { ImageMeta } from "./types";

export const secondaryBtn =
  "flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/4 px-5 py-3 text-sm font-medium text-white/60 transition hover:border-white/15 hover:bg-white/8 hover:text-white active:scale-[0.98]";

export function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-white/60">
      {children}
    </label>
  );
}

export function InfoBanner({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: Tone;
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1 rounded-xl border p-4 text-xs ${TONES[tone].banner}`}>
      <p className="flex items-center gap-2 font-semibold">
        <Icon size={14} aria-hidden /> {title}
      </p>
      <div className="space-y-0.5 leading-relaxed opacity-80">{children}</div>
    </div>
  );
}

export function StatusBadge({ text, tone = "violet" }: { text: string; tone?: Tone }) {
  return (
    <div role="status" className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${TONES[tone].banner}`}>
      <Loader2 size={14} className="shrink-0 animate-spin" aria-hidden />
      {text}
    </div>
  );
}

export function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {children}
    </p>
  );
}

export function PanelSkeleton() {
  return (
    <div aria-hidden className="space-y-4">
      <div className="h-24 animate-pulse rounded-xl bg-white/4" />
      <div className="h-56 animate-pulse rounded-2xl bg-white/4" />
    </div>
  );
}

const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];

export function DropZone({ onFile, label = "Drop an image here, or click to choose" }: { onFile: (f: File) => void; label?: string }) {
  const toast = useToast();
  const [drag, setDrag] = useState(false);

  const accept = (f?: File) => {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) return toast("Please choose a PNG, JPG or WEBP image.");
    if (f.size > MAX_FILE_MB * 1_048_576) return toast(`That file is over ${MAX_FILE_MB} MB.`);
    onFile(f);
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        accept(e.dataTransfer.files[0]);
      }}
      className={`flex cursor-pointer select-none flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors focus-within:outline-2 focus-within:outline-indigo-400 ${
        drag ? "border-white/30 bg-white/5" : "border-white/10 hover:border-white/20 hover:bg-white/3"
      }`}
    >
      <span className="rounded-xl bg-white/5 p-3">
        <Upload size={20} className="text-white/40" aria-hidden />
      </span>
      <span className="text-center">
        <span className="block text-sm text-white/60">{label}</span>
        <span className="mt-1 block text-xs text-white/30">PNG, JPG or WEBP, up to {MAX_FILE_MB} MB</span>
      </span>
      <input
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        onChange={(e) => {
          accept(e.target.files?.[0]);
          e.target.value = ""; // allow choosing the same file again
        }}
      />
    </label>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start gap-3 border-b border-white/5 py-2 last:border-0">
      <span className="w-14 shrink-0 text-xs text-white/35">{label}</span>
      <span className="flex-1 break-words text-xs leading-relaxed text-white/70">{value}</span>
      <button
        type="button"
        aria-label={`Copy ${label.toLowerCase()}`}
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="mt-0.5 shrink-0 text-white/25 transition-colors hover:text-white/60"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
}

export function MetaPanel({ meta }: { meta: ImageMeta }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-1">
      {meta.prompt && <MetaRow label="Prompt" value={meta.prompt} />}
      {meta.model && <MetaRow label="Model" value={meta.model} />}
      {meta.width && <MetaRow label="Size" value={`${meta.width} × ${meta.height} px`} />}
      <MetaRow label="Date" value={meta.createdAt.toLocaleString()} />
    </div>
  );
}

/** Large result with hover actions; shows a right-sized copy from the CDN. */
export function ResultCard({
  url,
  meta,
  onDownload,
  onClear,
}: {
  url: string;
  meta: ImageMeta;
  onDownload: () => void;
  onClear?: () => void;
}) {
  const [showMeta, setShowMeta] = useState(false);
  const actions = [
    { icon: Info, label: "Details", onClick: () => setShowMeta((v) => !v) },
    { icon: Download, label: "Download", onClick: onDownload },
    ...(onClear ? [{ icon: X, label: "Dismiss", onClick: onClear }] : []),
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
      <div className="group relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl(url)}
          alt={meta.prompt ?? "Result"}
          decoding="async"
          className="checker max-h-[28rem] w-full object-contain"
        />
        <div className="absolute right-3 top-3 flex gap-1.5 opacity-100 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
          {actions.map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              aria-label={label}
              title={label}
              className="rounded-lg bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
      {showMeta && (
        <div className="border-t border-white/6 p-4">
          <MetaPanel meta={meta} />
        </div>
      )}
    </div>
  );
}
