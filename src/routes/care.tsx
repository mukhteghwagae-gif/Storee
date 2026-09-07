import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/care")({
  component: Care,
  head: () => ({ meta: [{ title: "Jewellery care — Sitara" }] }),
});

function Care() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Care" }]} />
      <h1 className="mt-6 font-display text-5xl">How to keep it</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-ink-soft">
        <p>Gold likes warmth. A bowl of lukewarm water, a drop of dish soap, a soft brush along the gallery. Rinse. Pat. A jeweller’s cloth once a month.</p>
        <p>Oxidized silver is meant to be dark in the recesses. Do not boil it in foil and soda. Wipe with microfibre, then a drop of mild soap, then dry like you mean it.</p>
        <p>Never toothpaste. Never lemon on stones. Never perfume on a chain still around the neck.</p>
        <p>Hallmarked 22k may be worn daily. Plated pieces are anti-tarnish; still, take them off for the pool.</p>
        <p>
          A longer method lives in{" "}
          <Link to="/journal/$slug" params={{ slug: "how-to-clean-silver-at-home" }} className="underline">
            the Journal
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
