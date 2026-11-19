import Link from "next/link";

export default function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight">
      {/* Plain <img>: the file is already a 3 KB WebP, so next/image would only add JavaScript. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo.webp" alt="" width={size} height={size} className="rounded-lg" />
      <span>
        <span className="bg-linear-to-r from-orange-400 to-indigo-400 bg-clip-text text-transparent">Genova</span>
        <span className="text-white/90"> AI</span>
      </span>
    </Link>
  );
}
