import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl">Privacy</h1>
      <p className="mt-6 leading-relaxed text-ink-soft">
        Sitara keeps only what the order requires: a name, a Pakistani mobile, an address. We do not sell lists. Reviews with photographs are shown on the piece you chose. Sign-in is Google, X, or email through this house’s own account desk.
      </p>
    </main>
  );
}
