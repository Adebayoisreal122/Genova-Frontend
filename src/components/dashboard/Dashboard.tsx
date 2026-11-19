"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Coins, LogOut, Menu, X } from "lucide-react";
import Wordmark from "@/components/Wordmark";
import { api, clearToken, getToken } from "@/lib/api";
import { NAV, TONES } from "./config";
import { ToastProvider, useToast } from "./Toast";
import { PanelSkeleton } from "./ui";
import { useGallery } from "./useGallery";
import GeneratePanel from "./panels/GeneratePanel";
import type { ImageModel, Tab, UserInfo } from "./types";

// Only the Generate tab is in the first bundle; the rest load when first opened.
const loading = () => <PanelSkeleton />;
const RemoveBgPanel = dynamic(() => import("./panels/RemoveBgPanel"), { loading });
const UpscalePanel = dynamic(() => import("./panels/UpscalePanel"), { loading });
const GalleryPanel = dynamic(() => import("./panels/GalleryPanel"), { loading });

function Studio() {
  const router = useRouter();
  const toast = useToast();
  const gallery = useGallery();
  const { loadFirst } = gallery;

  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("generate");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [models, setModels] = useState<ImageModel[]>([]);

  // Auth guard, then fetch everything the first screen needs in parallel.
  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
    api<{ user: UserInfo }>("/api/auth/me").then((d) => setUser(d.user)).catch((e) => toast(e.message));
    api<{ models: ImageModel[] }>("/api/images/models").then((d) => setModels(d.models)).catch((e) => toast(e.message));
    loadFirst();
  }, [router, toast, loadFirst]);

  const setCredits = useCallback((n: number) => setUser((u) => (u ? { ...u, credits: n } : u)), []);

  const logout = () => {
    clearToken();
    router.replace("/login");
  };

  if (!ready) return <div className="h-dvh bg-[#07070d]" />;

  const current = NAV.find((n) => n.id === tab) ?? NAV[0];
  const credits = user?.credits ?? null;

  return (
    <div className="flex h-dvh overflow-hidden bg-[#07070d] text-white">
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/65 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-white/5 bg-[#0b0b17] transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-4">
          <Wordmark size={24} />
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="p-1 text-white/30 transition-colors hover:text-white/70 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav aria-label="Tools" className="thin-scroll flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {NAV.map(({ id, label, icon: Icon, tag, tone }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  setSidebarOpen(false);
                }}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2.5 text-left text-sm font-medium transition ${
                  active ? TONES[tone].active : "border-transparent text-white/45 hover:bg-white/4 hover:text-white/75"
                }`}
              >
                <Icon size={16} className={active ? "" : "opacity-50"} aria-hidden />
                <span className="flex-1 leading-none">{label}</span>
                {id === "gallery" && gallery.total > 0 && <span className="text-xs text-white/30">{gallery.total}</span>}
                {tag && <span className="rounded bg-white/6 px-1.5 py-0.5 text-[10px] font-semibold text-white/35">{tag}</span>}
                {active && <ChevronRight size={11} className="shrink-0 opacity-40" aria-hidden />}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-white/5 p-2.5">
          {user && (
            <p className="truncate px-2.5 py-1 text-xs text-white/35" title={user.email}>
              {user.name || user.email}
            </p>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm text-white/40 transition hover:bg-red-500/5 hover:text-red-300"
          >
            <LogOut size={14} aria-hidden /> Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center gap-3.5 border-b border-white/5 px-5 py-3.5">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="rounded-xl bg-white/4 p-2 text-white/50 transition-colors hover:bg-white/8 lg:hidden"
          >
            <Menu size={16} />
          </button>

          <span className={`shrink-0 rounded-lg border p-1.5 ${TONES[current.tone].active}`}>
            <current.icon size={16} aria-hidden />
          </span>
          <h1 className="min-w-0 flex-1 truncate text-sm font-semibold">{current.label}</h1>

          <div
            title="Each generated image uses one credit"
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs ${
              credits === 0
                ? "border-red-500/25 bg-red-500/10 text-red-300"
                : credits !== null && credits <= 2
                  ? "border-amber-500/25 bg-amber-500/10 text-amber-300"
                  : "border-white/8 bg-white/4 text-white/60"
            }`}
          >
            <Coins size={12} aria-hidden />
            {credits === null ? "…" : `${credits} credit${credits === 1 ? "" : "s"}`}
          </div>
        </header>

        <main className="thin-scroll flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-6">
            {tab === "generate" && (
              <GeneratePanel models={models} credits={credits} onCreated={gallery.add} onCredits={setCredits} />
            )}
            {tab === "remove-bg" && <RemoveBgPanel onSaved={gallery.add} />}
            {tab === "upscale" && <UpscalePanel onSaved={gallery.add} />}
            {tab === "gallery" && (
              <GalleryPanel
                items={gallery.items}
                total={gallery.total}
                loading={gallery.loading}
                loadingMore={gallery.loadingMore}
                hasMore={gallery.hasMore}
                onLoadMore={gallery.loadMore}
                onDelete={gallery.remove}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ToastProvider>
      <Studio />
    </ToastProvider>
  );
}
