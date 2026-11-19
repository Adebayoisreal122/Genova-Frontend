"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { primaryBtn } from "./styles";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050508]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
        <Wordmark />

        <nav aria-label="Main" className="hidden items-center gap-8 text-sm text-white/55 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="px-4 py-2 text-sm text-white/60 transition-colors hover:text-white">
            Sign in
          </Link>
          <Link href="/register" className={`${primaryBtn} px-4! py-2!`}>
            Get started
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-t border-white/5 bg-[#050508] px-5 pb-5 pt-2 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/5 py-3 text-sm text-white/60 last:border-0 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            <Link
              href="/login"
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-center text-sm text-white/70"
            >
              Sign in
            </Link>
            <Link href="/register" className={`${primaryBtn} flex-1 py-2.5!`}>
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
