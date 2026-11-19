"use client";

import { useEffect, useState } from "react";
import { Download, Lightbulb, Loader2, Wand2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { TONES } from "../config";
import { downloadImage } from "../download";
import { ErrorNote, FieldLabel, InfoBanner, ResultCard, StatusBadge, secondaryBtn } from "../ui";
import { toItem, type DbImage, type ImageMeta, type ImageModel } from "../types";

const PROMPT_MAX = 1000;

interface Props {
  models: ImageModel[];
  credits: number | null;
  onCreated: (image: DbImage) => void;
  onCredits: (n: number) => void;
}

export default function GeneratePanel({ models, credits, onCreated, onCredits }: Props) {
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; meta: ImageMeta } | null>(null);

  const selected = modelId || models[0]?.id || "";
  const outOfCredits = credits !== null && credits <= 0;

  // Elapsed-time counter while waiting, so a slow model doesn't look frozen.
  useEffect(() => {
    if (!loading) return;
    setSeconds(0);
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [loading]);

  const generate = async () => {
    if (!prompt.trim() || !selected || loading || outOfCredits) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { image, credits: left } = await api<{ image: DbImage; credits: number }>("/api/images/generate", {
        method: "POST",
        json: { prompt: prompt.trim(), model: selected },
      });
      const item = toItem(image);
      setResult({ url: item.url, meta: item.meta });
      onCreated(image);
      onCredits(left);
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) onCredits(0);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="model">Model</FieldLabel>
        <select
          id="model"
          value={selected}
          onChange={(e) => setModelId(e.target.value)}
          disabled={!models.length}
          className="w-full cursor-pointer appearance-none rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white transition-colors focus:border-white/25 focus:outline-none disabled:opacity-50"
        >
          {models.length === 0 && <option>Loading models…</option>}
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
              {m.hint ? ` — ${m.hint}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel htmlFor="prompt">Your prompt</FieldLabel>
        <textarea
          id="prompt"
          rows={4}
          maxLength={PROMPT_MAX}
          placeholder="A misty mountain range at golden hour, photorealistic, 8K…"
          className="w-full resize-none rounded-xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/25 transition-colors focus:border-white/25 focus:outline-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
          }}
        />
        <p className="mt-1 flex justify-between text-xs text-white/30">
          <span>Ctrl/Cmd + Enter to generate</span>
          <span>
            {prompt.length}/{PROMPT_MAX}
          </span>
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={generate}
          disabled={loading || !prompt.trim() || !selected || outOfCredits}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${TONES.violet.button}`}
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Wand2 size={15} /> Generate · 1 credit
            </>
          )}
        </button>
        <button
          onClick={() => {
            setPrompt("");
            setResult(null);
            setError("");
          }}
          className="rounded-xl bg-white/4 px-4 py-3 text-sm text-white/40 transition hover:bg-white/8 hover:text-white/70"
        >
          Clear
        </button>
      </div>

      {outOfCredits && <ErrorNote>You&apos;re out of credits. Background removal and upscaling are still free.</ErrorNote>}
      {loading && <StatusBadge text={`Generating your image… ${seconds}s`} />}
      {error && <ErrorNote>{error}</ErrorNote>}

      {result && (
        <div className="space-y-3">
          <ResultCard
            url={result.url}
            meta={result.meta}
            onClear={() => setResult(null)}
            onDownload={() => downloadImage(result.url, "genova-image")}
          />
          <button onClick={() => downloadImage(result.url, "genova-image")} className={`${secondaryBtn} w-full`}>
            <Download size={14} /> Download image
          </button>
        </div>
      )}

      <InfoBanner tone="violet" icon={Lightbulb} title="Tips for better results">
        <p>Add detail: subject, style, lighting, mood. For example &ldquo;cinematic, golden hour, wide-angle lens&rdquo;.</p>
        <p>Credits are only used when an image is delivered. If a model fails, your credit is returned.</p>
      </InfoBanner>
    </div>
  );
}
