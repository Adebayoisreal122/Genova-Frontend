import { Check, LayoutGrid, Scissors, Sparkles, ZoomIn, type LucideIcon } from "lucide-react";

const FEATURES: {
  icon: LucideIcon;
  title: string;
  desc: string;
  bullets: string[];
  tone: string;
}[] = [
  {
    icon: Sparkles,
    title: "Generate from text",
    desc: "Describe what you want and pick a model. Each generation costs one credit, and you start with ten.",
    bullets: ["FLUX and Stable Diffusion models", "Ctrl/Cmd + Enter to generate", "Saved to your gallery automatically"],
    tone: "bg-violet-500/10 text-violet-300",
  },
  {
    icon: Scissors,
    title: "Remove backgrounds",
    desc: "Drop in a photo and get a transparent PNG back. Handles people, products and fiddly edges.",
    bullets: ["No manual masking", "Before and after, side by side", "Free to use"],
    tone: "bg-emerald-500/10 text-emerald-300",
  },
  {
    icon: ZoomIn,
    title: "Upscale up to 4×",
    desc: "Enlarge an image to 1.5×, 2×, 3× or 4× right in your browser. Fast, free and nothing to install.",
    bullets: ["Shows the output size before you start", "Runs on your device", "Free to use"],
    tone: "bg-amber-500/10 text-amber-300",
  },
  {
    icon: LayoutGrid,
    title: "One gallery for everything",
    desc: "Everything you make is saved to your account and served from a global CDN, so it opens quickly anywhere.",
    bullets: ["Filter by generated, cut out or upscaled", "Full-size preview with details", "Download or delete in one click"],
    tone: "bg-rose-500/10 text-rose-300",
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 px-5 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">Four tools, one studio</h2>
          <p className="mt-4 text-white/50">
            Everything lives in the same sidebar, so going from idea to finished image never means switching apps.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc, bullets, tone }) => (
            <article key={title} className="flex flex-col gap-5 rounded-2xl border border-white/8 bg-white/3 p-7">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon size={20} aria-hidden />
              </span>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{desc}</p>
              </div>
              <ul className="space-y-2">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-white/60">
                    <Check size={14} className="mt-0.5 shrink-0 text-white/35" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
