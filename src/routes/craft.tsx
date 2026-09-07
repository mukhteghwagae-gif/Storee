import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/craft")({ component: Craft });

function Craft() {
  return (
    <main>
      <section className="relative min-h-[70dvh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/craft.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/editorial/craft.jpg"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-end px-4 pb-16 text-ivory">
          <p className="text-[11px] uppercase tracking-[0.24em]">The atelier</p>
          <h1 className="mt-3 max-w-xl font-display text-5xl md:text-6xl">Made in Pakistan. Marked as such.</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-display text-4xl">A bench, not a factory</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Sitara works with karigars in Lahore who still chase a seam by hand. Gold arrives as grain, becomes wire, becomes a gallery. Emeralds are bedded, not glued. If a piece cannot take a hallmark, we do not call it gold.
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            You can visit on Tuesdays, by appointment. The light in the old city is the only marketing we trust.
          </p>
        </div>
        <img src="/editorial/polish.jpg" alt="Polishing a gold ring" className="rounded-2xl object-cover" />
      </section>
      <section className="bg-ivory-deep py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          {[
            ["Hallmark", "22k and 925 pieces over two grams leave with a Karatstamp and our maker’s mark."],
            ["Stone policy", "We name the gem honestly. Cubic zirconia is called light. Emerald is called emerald."],
            ["Repair", "A lifetime of resizing and a complimentary first polish within a year."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl bg-ivory p-6">
              <h3 className="font-display text-2xl">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="font-display text-4xl">See the work on a person</h2>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link to="/shop">Shop gold</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/try-on">Try on</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
