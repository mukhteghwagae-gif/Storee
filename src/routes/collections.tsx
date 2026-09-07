import { createFileRoute, Link } from "@tanstack/react-router";
import { COLLECTIONS } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/collections")({
  component: Collections,
  head: () => ({ meta: [{ title: "Collections — Sitara" }] }),
});

const IMAGES: Record<string, string> = {
  "bridal-couture": "/editorial/bridal.jpg",
  "everyday-gold": "/editorial/everyday.jpg",
  "office-edit": "/editorial/lookbook.jpg",
  "party-lights": "/products/emerald-teardrop.jpg",
  "silver-stones": "/products/moonlight-choker.jpg",
  "stack-layer": "/editorial/hand-stack.jpg",
};

function Collections() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Collections" }]} />
      <h1 className="mt-6 font-display text-5xl">A house in six rooms</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {COLLECTIONS.map((c) => (
          <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }} className="group relative overflow-hidden rounded-2xl">
            <img src={IMAGES[c.slug]} alt="" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-ivory">
              <h2 className="font-display text-2xl">{c.name}</h2>
              <p className="mt-1 text-sm text-ivory/80">{c.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
