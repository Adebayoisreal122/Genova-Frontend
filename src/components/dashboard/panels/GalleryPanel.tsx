"use client";

import { useEffect, useState } from "react";
import { Download, LayoutGrid, Loader2, Trash2, X } from "lucide-react";
import { TONES, TYPE_LABELS } from "../config";
import { downloadImage } from "../download";
import { MetaPanel } from "../ui";
import { previewUrl, thumbUrl } from "@/lib/cloudinary";
import type { GalleryItem, ImageType } from "../types";

interface Props {
  items: GalleryItem[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onDelete: (id: string) => void;
}

const FILTERS: (ImageType | "all")[] = ["all", "generated", "bg-removed", "upscaled"];

function TypeChip({ type }: { type: ImageType }) {
  const { label, tone } = TYPE_LABELS[type];
  return <span className={`w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold ${TONES[tone].chip}`}>{label}</span>;
}

export default function GalleryPanel({ items, total, loading, loadingMore, hasMore, onLoadMore, onDelete }: Props) {
  const [filter, setFilter] = useState<ImageType | "all">("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  // Escape closes the lightbox.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const remove = (id: string) => {
    if (window.confirm("Delete this image? This can't be undone.")) {
      onDelete(id);
      setSelected(null);
    }
  };

  if (loading) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 py-20 text-white/30">
        <Loader2 size={28} strokeWidth={1.5} className="animate-spin" />
        <p className="text-sm">Loading your gallery…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-white/30">
        <LayoutGrid size={36} strokeWidth={1.25} />
        <p className="text-sm">Images you make will show up here.</p>
      </div>
    );
  }

  const shown = filter === "all" ? items : items.filter((i) => i.type === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count = f === "all" ? total : items.filter((i) => i.type === f).length;
          if (f !== "all" && count === 0) return null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                filter === f
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/8 text-white/40 hover:border-white/15 hover:text-white/70"
              }`}
            >
              {f === "all" ? `All (${count})` : `${TYPE_LABELS[f].label} (${count})`}
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item) => (
          <li key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-white/8 bg-white/3">
            <button
              onClick={() => setSelected(item)}
              aria-label={`Open ${item.meta.prompt ?? TYPE_LABELS[item.type].label}`}
              className="absolute inset-0"
            >
              {/* Cloudinary serves a 480px WebP/AVIF thumbnail instead of the full-size file. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl(item.url)}
                alt={item.meta.prompt ?? TYPE_LABELS[item.type].label}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-linear-to-t from-black/80 via-black/30 to-transparent p-3 pt-10 opacity-100 transition-opacity lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
              <TypeChip type={item.type} />
              {item.meta.prompt && <p className="truncate text-xs text-white/70">{item.meta.prompt}</p>}
              <div className="pointer-events-auto flex gap-1.5">
                <button
                  onClick={() => downloadImage(item.url, item.type)}
                  aria-label="Download"
                  className="rounded-lg bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
                >
                  <Download size={12} />
                </button>
                <button
                  onClick={() => remove(item.id)}
                  aria-label="Delete"
                  className="rounded-lg bg-white/10 p-1.5 text-white transition-colors hover:bg-red-500/60"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/60 transition hover:border-white/25 hover:text-white disabled:opacity-50"
          >
            {loadingMore && <Loader2 size={14} className="animate-spin" />} Load more
          </button>
        </div>
      )}

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image details"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div className="my-auto w-full max-w-xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <TypeChip type={selected.type} />
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="rounded-xl bg-white/8 p-2 text-white transition-colors hover:bg-white/15"
              >
                <X size={15} />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl(selected.url)}
              alt={selected.meta.prompt ?? "Image"}
              className="checker w-full rounded-2xl border border-white/10"
            />
            <MetaPanel meta={selected.meta} />
            <div className="flex gap-3">
              <button
                onClick={() => downloadImage(selected.url, selected.type)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/8 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/12"
              >
                <Download size={14} /> Download
              </button>
              <button
                onClick={() => remove(selected.id)}
                aria-label="Delete"
                className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/20"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
