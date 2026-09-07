import { createFileRoute, Link } from "@tanstack/react-router";
import { cartSubtotal, freeShippingGap, hydrateLines, useSitara } from "@/lib/store";
import { formatPkr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useStorefront } from "@/components/storefront";
import { ProductCard } from "@/components/product-card";
import { personalizedFromHistory } from "@/lib/recommendations";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Bag — Sitara" }] }),
});

function CartPage() {
  const cart = useSitara((s) => s.cart);
  const setQty = useSitara((s) => s.setQty);
  const remove = useSitara((s) => s.remove);
  const giftWrap = useSitara((s) => s.giftWrap);
  const setGiftWrap = useSitara((s) => s.setGiftWrap);
  const recently = useSitara((s) => s.recentlyViewed);
  const { settings, productBySlug, products } = useStorefront();
  const lines = hydrateLines(cart, productBySlug);
  const sub = cartSubtotal(cart, productBySlug);
  const gap = freeShippingGap(sub, settings.free_shipping_over);
  const recs = personalizedFromHistory(recently, products, 4);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl">Your bag</h1>
      {lines.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-ink-soft">Nothing here yet.</p>
          <Button className="mt-6" asChild>
            <Link to="/shop">Browse the house</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-stone">
            {gap === 0 ? "Complimentary shipping unlocked." : `Add ${formatPkr(gap)} for complimentary shipping.`}
          </p>
          <ul className="mt-8 divide-y divide-border">
            {lines.map(({ product, line }) => (
              <li key={`${product.slug}-${line.size ?? ""}`} className="flex gap-4 py-5">
                <img src={product.images[0]} alt="" className="size-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <Link to="/shop/$slug" params={{ slug: product.slug }} className="font-display text-2xl">
                    {product.name}
                  </Link>
                  {line.size && <p className="text-xs text-stone">Size {line.size}</p>}
                  <p className="tabular-nums">{formatPkr(product.price)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button type="button" className="grid size-10 place-items-center" onClick={() => setQty(product.slug, line.size, line.qty - 1)}>
                      −
                    </button>
                    <span className="tabular-nums">{line.qty}</span>
                    <button type="button" className="grid size-10 place-items-center" onClick={() => setQty(product.slug, line.size, line.qty + 1)}>
                      +
                    </button>
                    <button type="button" className="ml-auto text-xs uppercase tracking-[0.14em] text-stone" onClick={() => remove(product.slug, line.size)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <label className="mt-6 flex items-center gap-3 text-sm">
            <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} />
            Cedar gift wrap · {formatPkr(settings.gift_wrap_pkr ?? 650)}
          </label>
          <div className="mt-8 flex items-center justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPkr(sub)}</span>
          </div>
          <Button className="mt-6 w-full" size="lg" asChild>
            <Link to="/checkout">Checkout</Link>
          </Button>
        </>
      )}
      {recs.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl">You were looking at</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {recs.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
