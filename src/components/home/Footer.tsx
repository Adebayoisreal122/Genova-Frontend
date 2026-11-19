import Link from "next/link";
import Wordmark from "@/components/Wordmark";

export default function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 border-t border-white/5 bg-[#07070c] px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Wordmark size={24} />
          <p className="max-w-xs text-sm text-white/40">
            Questions, partnerships or press?{" "}
            <a href="mailto:contact@genovaai.app" className="text-white/70 underline-offset-4 hover:underline">
              contact@genovaai.app
            </a>
          </p>
        </div>
        <div className="flex gap-6 text-sm text-white/45">
          <Link href="/login" className="hover:text-white/80">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-white/80">
            Register
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-white/25">© {new Date().getFullYear()} Genova AI</p>
    </footer>
  );
}
