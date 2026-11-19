import Link from "next/link";
import { ghostBtn, primaryBtn } from "./styles";

export default function CallToAction() {
  return (
    <section className="px-5 pb-24 md:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-linear-to-br from-violet-500/10 via-transparent to-orange-500/10 px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Ready to make something?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50">
          Sign up free and get ten generations, plus background removal, upscaling and your own gallery.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/register" className={primaryBtn}>
            Start creating free
          </Link>
          <Link href="/login" className={ghostBtn}>
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
