const STEPS = [
  { title: "Create a free account", desc: "An email and a password. No card, and ten generations are included." },
  { title: "Pick a tool", desc: "Generate, remove a background or upscale. Each one is a click away in the sidebar." },
  { title: "Download your image", desc: "Compare the result, find it again in your gallery, and download it whenever you like." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-[#07070c] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 font-display text-3xl font-bold tracking-tight md:text-4xl">Up and running in a minute</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-white/8 bg-white/3 p-6">
              <span className="font-display text-4xl font-extrabold text-white/20">{i + 1}</span>
              <h3 className="mt-4 font-display text-base font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
