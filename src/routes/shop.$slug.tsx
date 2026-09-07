import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, MessageCircle, RotateCcw, ScanLine, Share2, ShieldCheck, Sparkles, Truck, X } from "lucide-react";
import { formatPkr } from "@/lib/format";
import { PK_SIZES, BANGLE_SIZES } from "@/lib/sizes";
import { useSitara } from "@/lib/store";
import { addReview, toggleStockAlert } from "@/lib/server/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useStock, useStorefront } from "@/components/storefront";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { frequentlyTogether, personalizedFromHistory, similarProducts } from "@/lib/recommendations";
import { estimateShipping } from "@/lib/shipping";
import { COLLECTIONS, PRODUCT_BY_SLUG, WHATSAPP_NUMBER } from "@/lib/catalog";
import { tryOnZoneFor } from "@/lib/ar/intelligence";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop/$slug")({
  component: Pdp,
  head: ({ params }) => {
    const p = PRODUCT_BY_SLUG[params.slug];
    return {
      meta: [
        { title: `${p?.name ?? params.slug} — Sitara` },
        {
          name: "description",
          content: p?.description.slice(0, 160) ?? "Sitara fine jewellery, Lahore.",
        },
      ],
    };
  },
});

function Pdp() {
  const { slug } = Route.useParams();
  const { productBySlug } = useStorefront();
  const product = productBySlug[slug];
  const view = useSitara((s) => s.view);
  useEffect(() => {
    if (product) {
      view(product.slug);
      trackEvent("product_view", { slug: product.slug });
    }
  }, [product, view]);

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">This piece has left the tray</h1>
        <Button className="mt-6" asChild>
          <Link to="/shop">Back to shop</Link>
        </Button>
      </main>
    );
  }

  return <PdpInner key={product.slug} />;
}

function PdpInner() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { productBySlug, products, reviews, refresh, settings } = useStorefront();
  const product = productBySlug[slug]!;
  const stock = useStock(product.slug);
  const addToCart = useSitara((s) => s.addToCart);
  const toggleWish = useSitara((s) => s.toggleWish);
  const wished = useSitara((s) => s.wishlist.includes(product.slug));
  const recently = useSitara((s) => s.recentlyViewed);
  const [img, setImg] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState(product.sizeType === "ring" ? "13" : product.sizeType === "bangle" ? "2.6" : undefined);
  const [added, setAdded] = useState(false);
  const [guide, setGuide] = useState(false);
  const { user } = useCurrentUserState();
  const mine = reviews.filter((r) => r.product_id === product.slug);
  const look = product.completeTheLook.map((s) => productBySlug[s]).filter(Boolean);
  const fbt = frequentlyTogether(product, products, 2);
  const similar = similarProducts(product, products, 4);
  const personal = personalizedFromHistory(recently, products, 4);
  const collectionName = COLLECTIONS.find((c) => c.slug === product.collection)?.name ?? product.collection.replace(/-/g, " ");
  const rating = mine.length > 0 ? mine.reduce((s, r) => s + r.rating, 0) / mine.length : null;
  const ship = estimateShipping({ city: "Lahore", subtotal: product.price, freeOver: settings.free_shipping_over });
  const wa = `https://wa.me/${settings.whatsapp_number || WHATSAPP_NUMBER}?text=${encodeURIComponent(`Salaam Sitara, I have a question about ${product.name}.`)}`;

  const jsonLd = useMemo(() => {
    const data: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images,
      description: product.description,
      sku: product.slug,
      brand: { "@type": "Brand", name: "Sitara" },
      offers: {
        "@type": "Offer",
        priceCurrency: "PKR",
        price: product.price,
        availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    };
    if (rating && mine.length) {
      data.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: rating.toFixed(1),
        reviewCount: mine.length,
      };
    }
    return JSON.stringify(data);
  }, [product, stock, rating, mine.length]);

  function add() {
    addToCart(product.slug, 1, size);
    setAdded(true);
    trackEvent("add_to_cart", { slug: product.slug });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 pb-28 md:pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Breadcrumbs
        items={[
          { to: "/shop", label: "Shop" },
          { to: `/collections/${product.collection}`, label: collectionName },
          { label: product.name },
        ]}
      />
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div>
          <button
            type="button"
            className="relative overflow-hidden rounded-2xl bg-ivory-deep"
            onClick={() => setZoom(true)}
          >
            <img
              src={product.images[img] ?? product.images[0]}
              alt={product.name}
              className="aspect-[3/4] w-full object-cover"
            />
          </button>
          {product.images.length > 1 && (
            <button
              type="button"
              className="mt-3 flex h-11 items-center gap-2 text-xs uppercase tracking-[0.14em]"
              onClick={() => setImg((i) => (i + 1) % product.images.length)}
            >
              <RotateCcw className="size-4" /> Turn the piece
            </button>
          )}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImg(i)}
                  className={cn("size-16 overflow-hidden rounded-md border", i === img ? "border-ink" : "border-transparent")}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-4xl md:text-5xl">{product.name}</h1>
          {product.urdu && (
            <p className="mt-1 font-naskh text-xl text-stone" lang="ur">
              {product.urdu}
            </p>
          )}
          <p className="mt-3 text-lg tabular-nums text-ink">{formatPkr(product.price)}</p>
          {product.compareAt && (
            <p className="text-sm text-stone line-through tabular-nums">{formatPkr(product.compareAt)}</p>
          )}
          <p className="mt-2 text-sm text-stone">
            {product.karat ?? product.metal}
            {product.weightG ? ` · ${product.weightG} g` : ""}
            {product.hallmarked ? " · Hallmarked" : ""}
            {product.gemstone ? ` · ${product.gemstone}` : ""}
          </p>
          {product.makingPkr > 0 && (
            <p className="mt-1 text-sm text-stone">
              Making {formatPkr(product.makingPkr)} — already in the price, not added at the counter.
            </p>
          )}
          {rating && (
            <p className="mt-2 text-sm text-stone">
              {rating.toFixed(1)} · {mine.length} review{mine.length === 1 ? "" : "s"}
            </p>
          )}
          {stock > 0 && stock <= 5 && <p className="mt-3 text-sm text-emerald">Only {stock} left on the tray.</p>}
          {stock <= 0 && <p className="mt-3 text-sm text-stone">Currently at the bench. Join the waitlist.</p>}
          <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

          {product.sizeType === "ring" && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Pakistani size</p>
                <button type="button" className="text-xs underline" onClick={() => setGuide(true)}>
                  Size guide
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PK_SIZES.map((s) => (
                  <button
                    key={s.pk}
                    type="button"
                    onClick={() => setSize(String(s.pk))}
                    className={cn(
                      "size-11 rounded-md border text-sm",
                      size === String(s.pk) ? "border-ink bg-ink text-ivory" : "border-border",
                    )}
                  >
                    {s.pk}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizeType === "bangle" && (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Inner diameter</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {BANGLE_SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    className={cn(
                      "h-10 rounded-md border px-3 text-sm",
                      size === s.id ? "border-ink bg-ink text-ivory" : "border-border",
                    )}
                  >
                    {s.inches}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {stock > 0 ? (
              <>
                <Button size="lg" className="flex-1" onClick={add}>
                  {added ? "Added to bag" : "Add to bag"}
                </Button>
                <Button
                  size="lg"
                  variant="gold"
                  onClick={() => {
                    add();
                    void navigate({ to: "/checkout" });
                  }}
                >
                  Buy now
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                className="flex-1"
                variant="outline"
                onClick={() => {
                  if (!user) {
                    window.location.assign("/login");
                    return;
                  }
                  void toggleStockAlert({ data: { product_id: product.slug } });
                }}
              >
                Notify when back
              </Button>
            )}
            <Button
              size="icon"
              variant="outline"
              aria-label="Save"
              onClick={() => {
                toggleWish(product.slug);
                trackEvent("wishlist", { slug: product.slug });
              }}
            >
              <Heart className={cn("size-4", wished && "fill-current text-emerald")} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Share"
              onClick={() => {
                const url = window.location.href;
                if (navigator.share) void navigator.share({ title: product.name, url });
                else void navigator.clipboard.writeText(url);
              }}
            >
              <Share2 className="size-4" />
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {tryOnZoneFor(product) && (
              <Button variant="ghost" asChild>
                <Link to="/try-on" search={{ piece: product.slug }}>
                  <ScanLine className="size-4" />
                  Virtual try-on
                </Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <a href={wa} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> WhatsApp enquiry
              </a>
            </Button>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-ink-soft">
            <li className="flex gap-3">
              <ShieldCheck className="size-4 shrink-0 text-emerald" />
              {product.hallmarked ? "Certified 22k / 925 hallmark" : "Atelier-finished fashion metal"}
            </li>
            <li className="flex gap-3">
              <Truck className="size-4 shrink-0 text-emerald" />
              Lahore {ship.days} days · rest of Pakistan 3–5 · complimentary over {formatPkr(settings.free_shipping_over)}
            </li>
            <li className="flex gap-3">
              <Sparkles className="size-4 shrink-0 text-emerald" />
              {product.antiTarnish ? "Anti-tarnish finish" : "Silver will oxidise in the recesses — that is the work"}
            </li>
          </ul>
          <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>

      {fbt.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl">Frequently together</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {fbt.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {look.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl">Complete the look</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {look.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <Reviews slug={product.slug} reviews={mine} onPosted={refresh} />

      <section className="mt-16">
        <h2 className="font-display text-3xl">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {similar.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {personal.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl">Recently in mind</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {personal.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {guide && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => setGuide(false)}>
          <div className="max-h-[80dvh] w-full max-w-lg overflow-auto rounded-2xl bg-ivory p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl">Ring sizes · PK / UK / US</h3>
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.14em] text-stone">
                  <th className="py-2">PK</th>
                  <th>UK</th>
                  <th>US</th>
                  <th>mm</th>
                </tr>
              </thead>
              <tbody>
                {PK_SIZES.map((s) => (
                  <tr key={s.pk} className="border-t border-border">
                    <td className="py-2">{s.pk}</td>
                    <td>{s.uk}</td>
                    <td>{s.us}</td>
                    <td className="tabular-nums">{s.mm.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button className="mt-4" variant="outline" asChild>
              <Link to="/size-guide">Full guide</Link>
            </Button>
          </div>
        </div>
      )}

      {zoom && (
        <div className="fixed inset-0 z-50 bg-ink/90 p-4" onClick={() => setZoom(false)}>
          <button type="button" className="absolute right-4 top-4 grid size-11 place-items-center text-ivory" aria-label="Close">
            <X />
          </button>
          <img src={product.images[img]} alt={product.name} className="mx-auto h-full max-h-[90dvh] object-contain" />
        </div>
      )}

      {stock > 0 && (
        <div className="fixed inset-x-0 bottom-14 z-30 border-t border-border bg-ivory/95 px-4 py-3 md:hidden">
          <div className="flex items-center gap-3">
            <span className="tabular-nums">{formatPkr(product.price)}</span>
            <Button className="flex-1" onClick={add}>
              {added ? "Added" : "Add to bag"}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

function Reviews({
  slug,
  reviews,
  onPosted,
}: {
  slug: string;
  reviews: { id: number; rating: number; title: string; body: string; photo_data_url: string | null; user_id: string }[];
  onPosted: () => void;
}) {
  const { user, isPending } = useCurrentUserState();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [photo, setPhoto] = useState<string | undefined>();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="font-display text-3xl">Reviews</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {reviews.length === 0 && <p className="text-sm text-stone">No collector reviews yet. Be the first after delivery.</p>}
        {reviews.map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-gold-deep">{"●".repeat(r.rating)}</p>
            <h3 className="mt-1 font-display text-xl">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
            {r.photo_data_url && <img src={r.photo_data_url} alt="" className="mt-3 max-h-48 rounded-md object-cover" />}
          </article>
        ))}
      </div>
      <div className="mt-10 max-w-lg">
        <h3 className="font-display text-2xl">Write a review</h3>
        {isPending ? (
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-ivory-deep" />
        ) : !user ? (
          <p className="mt-3 text-sm text-stone">
            <Link to="/login" className="underline">
              Sign in
            </Link>{" "}
            after a delivered order to review — you earn 25 gold coins.
          </p>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setMsg(null);
              try {
                await addReview({
                  data: { product_id: slug, rating, title, body, photo_data_url: photo },
                });
                setTitle("");
                setBody("");
                setPhoto(undefined);
                setMsg("Thank you. Coins have been added.");
                trackEvent("review", { slug });
                onPosted();
              } catch (err) {
                setMsg(err instanceof Error ? err.message : "Could not post");
              }
            }}
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} className={n <= rating ? "text-gold-deep" : "text-border"}>
                  ●
                </button>
              ))}
            </div>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm"
            />
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="How did it wear?"
              className="min-h-28 w-full rounded-lg border border-border bg-card p-3 text-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => setPhoto(String(reader.result));
                reader.readAsDataURL(f);
              }}
            />
            {msg && <p className="text-sm">{msg}</p>}
            <Button type="submit">Post review</Button>
          </form>
        )}
      </div>
    </section>
  );
}
