"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Kind = "error" | "success";
type Push = (message: string, kind?: Kind) => void;

const ToastContext = createContext<Push>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ id: number; message: string; kind: Kind }[]>([]);
  const nextId = useRef(0);

  const push = useCallback<Push>((message, kind = "error") => {
    const id = ++nextId.current;
    setItems((p) => [...p.slice(-2), { id, message, kind }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-60 flex flex-col items-end gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${
              t.kind === "error"
                ? "border-red-500/25 bg-red-950/80 text-red-100"
                : "border-emerald-500/25 bg-emerald-950/80 text-emerald-100"
            }`}
          >
            {t.kind === "error" ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
