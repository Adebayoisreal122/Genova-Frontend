import type { InputHTMLAttributes } from "react";

export default function Field({
  label,
  id,
  ...props
}: { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white/70">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 transition-colors focus:border-indigo-400/60 focus:outline-none"
      />
    </div>
  );
}
