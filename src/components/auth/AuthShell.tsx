import Wordmark from "@/components/Wordmark";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="drift absolute left-1/2 top-16 h-136 w-136 -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(99,102,241,0.2),transparent)]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Wordmark size={32} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/4 p-7 sm:p-8">
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-white/50">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-6 text-center text-sm text-white/45">{footer}</p>
      </div>
    </main>
  );
}
