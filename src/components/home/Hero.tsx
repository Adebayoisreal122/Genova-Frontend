import Link from "next/link";
import Marquee from "./Marquee";
import { ghostBtn, primaryBtn } from "./styles";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pt-40">
      {/* Soft colour behind the headline. Plain CSS gradients, no canvas, no blur filters. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="drift absolute -left-24 -top-24 h-120 w-120 bg-[radial-gradient(closest-side,rgba(124,58,237,0.22),transparent)]" />
        <div className="drift absolute -right-24 top-10 h-104 w-104 bg-[radial-gradient(closest-side,rgba(249,115,22,0.14),transparent)] [animation-delay:-7s]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <p className="rise mx-auto mb-7 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/60">
          10 free generations when you sign up
        </p>

        {/* No entrance animation on the headline, so it paints as fast as possible. */}
        <h1 className="text-balance font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Generate. Enhance. Perfect.
        </h1>

        <p className="rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 [animation-delay:120ms] md:text-lg">
          A small creative studio in your browser: make images from text, cut out backgrounds, upscale up to 4×,
          and keep everything in one gallery.
        </p>

        <div className="rise mt-8 flex flex-col justify-center gap-3 [animation-delay:200ms] sm:flex-row">
          <Link href="/register" className={primaryBtn}>
            Start creating free
          </Link>
          <Link href="#features" className={ghostBtn}>
            See what&apos;s inside
          </Link>
        </div>
      </div>

      <div className="rise relative mt-16 [animation-delay:320ms]">
        <Marquee />
      </div>
    </section>
  );
}
