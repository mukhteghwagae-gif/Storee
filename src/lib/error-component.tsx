import type { ErrorComponentProps } from "@tanstack/react-router";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ivory px-6 text-center text-ink">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">Sitara</p>
      <h1 className="font-display text-4xl">The tray slipped</h1>
      <p className="max-w-md text-sm break-words text-ink-soft">
        {error.message || "An unexpected error occurred. Try reloading the page."}
      </p>
      <a href="/" className="mt-2 text-sm uppercase tracking-[0.16em] underline">
        Return to the house
      </a>
    </main>
  );
}
