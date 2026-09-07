import { ProductCard } from "./product-card";
import { Breadcrumbs } from "./breadcrumbs";
import type { Product } from "@/lib/catalog";

export function CatalogPage({
  kicker,
  title,
  dek,
  products,
  crumbs,
}: {
  kicker: string;
  title: string;
  dek: string;
  products: Product[];
  crumbs: { to?: string; label: string }[];
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumbs items={crumbs} />
      <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-stone">{kicker}</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-xl text-ink-soft">{dek}</p>
      {products.length === 0 ? (
        <p className="mt-12 text-sm text-stone">Nothing on this tray yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </main>
  );
}
