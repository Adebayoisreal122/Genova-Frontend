const SAMPLES = [1, 2, 3, 4, 5, 6];

// Pure CSS loop: no JavaScript, no animation library.
export default function Marquee() {
  const row = [...SAMPLES, ...SAMPLES]; // second copy makes the -50% loop seamless

  return (
    <div className="marquee overflow-hidden" role="group" aria-label="Examples of images made with Genova AI">
      <div className="marquee-track">
        {row.map((n, i) => {
          const duplicate = i >= SAMPLES.length;
          return (
            <div
              key={i}
              aria-hidden={duplicate}
              className="mr-4 h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 md:h-52 md:w-52"
            >
              {/* Pre-compressed 640px WebP; a plain <img> keeps this a zero-JavaScript server component. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/samples/sample${n}.webp`}
                alt={duplicate ? "" : `Example image ${n}`}
                width={640}
                height={640}
                loading={i < 6 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
