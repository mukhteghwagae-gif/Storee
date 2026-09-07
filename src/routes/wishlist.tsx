import { createFileRoute, Link } from "@tanstack/react-router";
import { useSitara } from "@/lib/store";
import { useStorefront } from "@/components/storefront";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/wishlist")({
  component: Wishlist,
  head: () => ({ meta: [{ title: "Wishlist — Sitara" }] }),
});

function Wishlist() {
  const wishlist = useSitara((s) => s.wishlist);
  const { productBySlug } = useStorefront();
  const items = wishlist.map((s) => productBySlug[s]).filter(Boolean);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="mt-6 font-display text-5xl">Saved</h1>
      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-ink-soft">Nothing saved yet.</p>
          <Button className="mt-6" asChild>
            <Link to="/shop">Browse the house</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
