import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS, type Category } from "@/lib/catalog";
import { ARTICLES } from "@/lib/journal";
import { formatPkr } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/newsletter-form";
import { useStorefront } from "@/components/storefront";
import { frequentlyTogether } from "@/lib/recommendations";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Sitara — Fine Jewellery, Lahore" },
      {
        name: "description",
        content:
          "Sitara is a Lahore house of hallmarked 22k gold, kundan, and the quiet pieces Pakistani women actually live in. Cash on delivery. Complimentary shipping over Rs 5,000.",
      },
    ],
  }),
});

const ORG_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "Sitara",
  url: "/",
  description: "Lahore house of hallmarked 22k gold, kundan, and daily pieces.",
  areaServed: "PK",
  currenciesAccepted: "PKR",
  paymentAccepted: "Cash on Delivery, Bank Transfer",
});

function Home() {
  const { products, reviews, settings } = useStorefront();
  const featured = products.filter((p) => p.featured);
  const newest = products.filter((p) => p.newest).slice(0, 4);
  const best = products.filter((p) => p.bestSeller).slice(0, 4);
  const lookHero = products.find((p) => p.completeTheLook.length >= 2) ?? products[0];
  const look = lookHero ? frequentlyTogether(lookHero, products, 3) : [];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_LD }} />
      <section className="relative min-h-[88dvh] overflow-hidden">
        <img src="/editorial/hero.jpg" alt="Sitara gold on emerald silk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/20" />
        <div className="relative mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32 text-ivory">
          <p className="sitara-rise text-[11px] uppercase tracking-[0.32em]">
            {settings.hero_kicker || "Lahore · Est. the bench"}
          </p>
          <h1 className="sitara-rise mt-4 max-w-xl font-display text-5xl leading-[0.95] md:text-7xl" style={{ animationDelay: "80ms" }}>
            {settings.hero_title || "Starlight, wrought in gold."}
          </h1>
          <p className="sitara-rise mt-5 max-w-md text-base text-ivory/85 md:text-lg" style={{ animationDelay: "140ms" }}>
            {settings.hero_dek ||
              "Hallmarked 22k, kundan that sits, and the daily pieces Pakistani women actually wear. Cash on delivery. A seven-day return."}
          </p>
          <div className="sitara-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
            <Button variant="gold" size="lg" asChild>
              <Link to="/shop">Shop the house</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-ivory/40 text-ivory hover:bg-ivory/10" asChild>
              <Link to="/bridal">Bridal couture</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        {[
          ["Certified 22k", "Every gold piece over 2 g leaves hallmarked."],
          ["Easy 7-day returns", "Unworn, original box, no theatre."],
          ["Pay as you live", "Cash on delivery across Pakistan. Wallets when connected."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-xl border border-border bg-card px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold-deep">{t}</p>
            <p className="mt-1 text-sm text-ink-soft">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Shop</p>
        <h2 className="mt-1 font-display text-4xl">By category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {(
            [
              ["necklace", "Necklaces", "/products/thread-chain.jpg"],
              ["earrings", "Earrings", "/products/lahore-jhumkas.jpg"],
              ["ring", "Rings", "/products/dawn-stack.jpg"],
              ["bangle", "Bangles", "/products/whisper-bangle.jpg"],
              ["bracelet", "Bracelets", "/products/constellation.jpg"],
              ["anklet", "Anklets", "/products/payal-stars.jpg"],
              ["tikka", "Tikka", "/products/sitara-tikka.jpg"],
            ] as [Category, string, string][]
          ).map(([slug, label, src]) => (
            <Link key={slug} to="/category/$slug" params={{ slug }} className="group relative overflow-hidden rounded-xl">
              <img src={src} alt="" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="absolute inset-x-0 bottom-0 bg-ink/50 px-3 py-3 font-display text-xl text-ivory">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Collections</p>
            <h2 className="mt-1 font-display text-4xl">A house in six rooms</h2>
          </div>
          <Link to="/collections" className="items-center gap-1 text-sm flex">
            All rooms <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto sitara-hide-scrollbar pb-2 md:grid md:grid-cols-3 md:overflow-visible">
          {COLLECTIONS.map((c, i) => {
            const img =
              i === 0
                ? "/editorial/bridal.jpg"
                : i === 1
                  ? "/editorial/everyday.jpg"
                  : i === 2
                    ? "/editorial/lookbook.jpg"
                    : i === 3
                      ? "/products/emerald-teardrop.jpg"
                      : i === 4
                        ? "/products/moonlight-choker.jpg"
                        : "/editorial/hand-stack.jpg";
            return (
              <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }} className="relative min-w-[78%] overflow-hidden rounded-2xl md:min-w-0">
                <img src={img} alt="" className="aspect-[4/5] w-full object-cover md:aspect-[5/4]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-ivory">
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <p className="mt-1 text-sm text-ivory/80">{c.blurb}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">The tray</p>
            <h2 className="mt-1 font-display text-4xl">Pieces we stand behind</h2>
          </div>
          <Link to="/bestsellers" className="text-sm">
            Best sellers
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Just in</p>
            <h2 className="mt-1 font-display text-4xl">New arrivals</h2>
          </div>
          <Link to="/arrivals" className="text-sm">
            All new
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {newest.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {best.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Most worn</p>
              <h2 className="mt-1 font-display text-4xl">Best sellers</h2>
            </div>
            <Link to="/bestsellers" className="text-sm">
              All best sellers
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {best.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Occasion</p>
        <h2 className="mt-1 font-display text-4xl">Shop the hour</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { to: "/bridal" as const, label: "Bridal", src: "/editorial/bridal.jpg", search: undefined },
            { to: "/shop" as const, label: "Party", src: "/products/emerald-teardrop.jpg", search: { occasion: "party" } },
            { to: "/shop" as const, label: "Office", src: "/editorial/lookbook.jpg", search: { occasion: "office" } },
            { to: "/shop" as const, label: "Everyday", src: "/editorial/everyday.jpg", search: { occasion: "everyday" } },
          ].map((item) => (
            <Link key={item.label} to={item.to} search={item.search} className="relative overflow-hidden rounded-xl">
              <img src={item.src} alt="" className="aspect-[4/5] w-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-ink/50 px-3 py-3 font-display text-xl text-ivory">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Style</p>
        <h2 className="mt-1 font-display text-4xl">Find your sentence</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/quiz">Style quiz</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/match">Outfit matcher</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/finder">Gift finder</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/stack">Stack builder</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/try-on">Atelier Mirror</Link>
          </Button>
        </div>
      </section>

      {lookHero && look.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Complete the look</p>
          <h2 className="mt-1 font-display text-4xl">{lookHero.name}, dressed</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <ProductCard product={lookHero} />
            {look.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="relative mt-8 overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover" src="/video/craft.mp4" autoPlay muted loop playsInline poster="/editorial/craft.jpg" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto flex min-h-[26rem] max-w-6xl flex-col justify-end px-4 py-16 text-ivory">
          <p className="text-[11px] uppercase tracking-[0.22em]">The bench</p>
          <h2 className="mt-2 max-w-lg font-display text-4xl md:text-5xl">Gold is not poured. It is chased.</h2>
          <Button variant="gold" className="mt-6 w-fit" asChild>
            <Link to="/craft">Our craft</Link>
          </Button>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">From collectors</p>
          <h2 className="mt-1 font-display text-4xl">Worn, then written</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <article key={r.id} className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-gold-deep">{"●".repeat(r.rating)}</p>
                <h3 className="mt-2 font-display text-xl">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Styled by you</p>
        <h2 className="mt-1 font-display text-4xl">Photographs after delivery</h2>
        {reviews.filter((r) => r.photo_data_url).length === 0 ? (
          <p className="mt-4 max-w-lg text-sm text-ink-soft">
            When a collector sends a photograph with a review, it lives here. We do not stage customer posts.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {reviews
              .filter((r) => r.photo_data_url)
              .slice(0, 8)
              .map((r) => (
                <figure key={r.id} className="overflow-hidden rounded-xl">
                  <img src={r.photo_data_url ?? ""} alt={r.title} className="aspect-square w-full object-cover" />
                  <figcaption className="mt-2 text-sm text-stone">{r.title}</figcaption>
                </figure>
              ))}
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
        <img src="/editorial/hand-stack.jpg" alt="Stacked gold rings" className="rounded-2xl object-cover" />
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Build your own</p>
          <h2 className="mt-2 font-display text-4xl">A stack is a sentence.</h2>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Choose three rings or bangles, see them on a hand, add the set at ten percent less. The atelier will not sell you four textures unless you insist.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/stack">Open the configurator</Link>
          </Button>
        </div>
      </section>

      <section className="bg-ivory-deep py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone">The Journal</p>
              <h2 className="mt-1 font-display text-4xl">Style, care, the bench</h2>
            </div>
            <Link to="/journal" className="text-sm">
              All essays
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {ARTICLES.slice(0, 3).map((a) => (
              <Link key={a.slug} to="/journal/$slug" params={{ slug: a.slug }} className="block">
                <img src={a.image} alt="" className="aspect-[16/10] w-full rounded-xl object-cover" />
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-stone">{a.category}</p>
                <h3 className="mt-1 font-display text-2xl leading-tight">{a.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{a.dek}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Lookbook</p>
            <h2 className="mt-1 font-display text-4xl">Styled in the house</h2>
          </div>
          <Link to="/lookbook" className="text-sm">
            Full lookbook
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            "/editorial/lookbook.jpg",
            "/editorial/bridal.jpg",
            "/products/lahore-jhumkas.jpg",
            "/editorial/everyday.jpg",
            "/products/dawn-stack.jpg",
            "/editorial/hand-stack.jpg",
            "/products/pearl-luna.jpg",
            "/products/gold-hoops.jpg",
          ].map((src) => (
            <img key={src} src={src} alt="Sitara lookbook" className="aspect-square w-full object-cover" />
          ))}
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">The list</p>
        <h2 className="mt-2 font-display text-4xl">First look at bridal edits</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">A code, occasionally. No mail is sent until the desk connects a provider.</p>
        <div className="mx-auto mt-6 max-w-md">
          <NewsletterForm />
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Refer a friend</p>
        <h2 className="mt-2 font-display text-4xl">She buys. You receive Rs 500.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          Share your Sitara code. When she completes her first order, store credit lands in your account.
        </p>
        <p className="mt-4 font-display text-2xl text-emerald">{formatPkr(500)} credit</p>
        <Button className="mt-6" asChild>
          <Link to="/account">Open your code</Link>
        </Button>
      </section>
    </main>
  );
}
