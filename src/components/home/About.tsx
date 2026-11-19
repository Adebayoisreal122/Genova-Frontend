import Link from "next/link";
import { Check } from "lucide-react";
import { primaryBtn } from "./styles";

const POINTS = [
  "Works in any modern browser, nothing to install",
  "Several image models to choose from",
  "Backgrounds removed in one click",
  "Upscale up to 4× on your own device",
];

export default function About() {
  return (
    <section className="px-5 py-24 md:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            No switching between apps. No settings maze.
          </h2>
          <p className="leading-relaxed text-white/50">
            Genova brings image generation, background removal and upscaling into one clean dashboard. Open it,
            describe what you want, and start creating.
          </p>
          <ul className="space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-white/65">
                <Check size={16} className="shrink-0 text-teal-300" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <Link href="/register" className={primaryBtn}>
            Open the studio
          </Link>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/about.webp"
          alt="An illustration made with Genova AI"
          width={960}
          height={538}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-2xl border border-white/10"
        />
      </div>
    </section>
  );
}
