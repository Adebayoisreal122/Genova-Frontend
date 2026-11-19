import { LayoutGrid, Scissors, Sparkles, ZoomIn, type LucideIcon } from "lucide-react";
import type { ImageType, Tab } from "./types";

export type Tone = "violet" | "emerald" | "amber" | "rose";

// Tailwind needs complete class names, so every tone is spelled out.
export const TONES: Record<Tone, { active: string; button: string; banner: string; chip: string }> = {
  violet: {
    active: "text-violet-300 bg-violet-500/10 border-violet-500/25",
    button: "bg-violet-600 hover:bg-violet-500",
    banner: "bg-violet-500/5 border-violet-500/15 text-violet-200/80",
    chip: "text-violet-300 bg-violet-500/15",
  },
  emerald: {
    active: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
    button: "bg-emerald-700 hover:bg-emerald-600",
    banner: "bg-emerald-500/5 border-emerald-500/15 text-emerald-200/80",
    chip: "text-emerald-300 bg-emerald-500/15",
  },
  amber: {
    active: "text-amber-300 bg-amber-500/10 border-amber-500/25",
    button: "bg-amber-700 hover:bg-amber-600",
    banner: "bg-amber-500/5 border-amber-500/15 text-amber-200/80",
    chip: "text-amber-300 bg-amber-500/15",
  },
  rose: {
    active: "text-rose-300 bg-rose-500/10 border-rose-500/25",
    button: "bg-rose-700 hover:bg-rose-600",
    banner: "bg-rose-500/5 border-rose-500/15 text-rose-200/80",
    chip: "text-rose-300 bg-rose-500/15",
  },
};

export const NAV: { id: Tab; label: string; icon: LucideIcon; tag?: string; tone: Tone }[] = [
  { id: "generate", label: "Generate image", icon: Sparkles, tone: "violet" },
  { id: "remove-bg", label: "Remove background", icon: Scissors, tag: "Free", tone: "emerald" },
  { id: "upscale", label: "Upscale image", icon: ZoomIn, tag: "Free", tone: "amber" },
  { id: "gallery", label: "My gallery", icon: LayoutGrid, tone: "rose" },
];

export const TYPE_LABELS: Record<ImageType, { label: string; tone: Tone }> = {
  generated: { label: "Generated", tone: "violet" },
  "bg-removed": { label: "Cut out", tone: "emerald" },
  upscaled: { label: "Upscaled", tone: "amber" },
};

export const MAX_FILE_MB = 10;
