import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute, getRouteApi, useNavigate } from "@tanstack/react-router";
import {
  CATEGORY_LABEL,
  COLLECTIONS,
  GEMSTONES,
  METAL_LABEL,
  OCCASION_LABEL,
  searchHaystack,
  type Category,
  type Metal,
  type Occasion,
  type Product,
} from "@/lib/catalog";
import { matchesQuery } from "@/lib/search";
import { ProductCard } from "@/components/product-card";
import { useStorefront } from "@/components/storefront";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { ShopSearch } from "./shop";

type Sort = "featured" | "newest" | "best" | "price-asc" | "price-desc";

const shopRoute = getRouteApi("/shop");

export const Route = createFileRoute("/shop/")({
  component: Shop,
  head: () => ({ meta: [{ title: "Shop — Sitara" }] }),
});

function Shop() {
  const search = shopRoute.useSearch();
  const navigate = useNavigate({ from: "/shop/" });
  const { products } = useStorefront();
  const metal = (search.metal as Metal | "all" | undefined) ?? "all";
  const category = (search.category as Category | "all" | undefined) ?? "all";
  const occasion = (search.occasion as Occasion | "all" | undefined) ?? "all";
  const collection = search.collection ?? "all";
  const sort = (search.sort as Sort) ?? "featured";
  const q = search.q ?? "";
  const [gem, setGem] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  function patch(partial: Partial<ShopSearch>) {
    void navigate({
      search: (prev) => {
        const next = { ...prev, ...partial };
        for (const key of Object.keys(next) as (keyof ShopSearch)[]) {
          const v = next[key];
          if (v === "all" || v === "" || v === undefined) delete next[key];
        }
        return next;
      },
      replace: true,
    });
  }

  useEffect(() => {
    if (q) trackEvent("search", { q });
  }, [q]);

  const list = useMemo(() => {
    let rows: Product[] = products.filter((p) => {
      if (q && !matchesQuery(searchHaystack(p), q)) return false;
      if (metal !== "all" && p.metal !== metal) return false;
      if (category !== "all" && p.category !== category) return false;
      if (occasion !== "all" && !p.occasion.includes(occasion)) return false;
      if (gem !== "all" && p.gemstone !== gem) return false;
      if (collection !== "all" && p.collection !== collection) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return Number(b.newest) - Number(a.newest);
      if (sort === "best") return Number(b.bestSeller) - Number(a.bestSeller);
      return Number(b.featured) - Number(a.featured);
    });
    return rows;
  }, [products, metal, category, occasion, gem, collection, maxPrice, sort, q]);

  const maxLabel = maxPrice >= 2000000 ? "Any" : `Rs ${(maxPrice / 1000).toFixed(0)}k`;

  const filters = (
    <div className="space-y-6 text-sm">
      <Field label="Collection">
        <select value={collection} onChange={(e) => patch({ collection: e.target.value })} className="sitara-select">
          <option value="all">All</option>
          {COLLECTIONS.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Metal">
        <ChipRow
          value={metal}
          onChange={(v) => patch({ metal: v })}
          options={[["all", "All"], ...Object.entries(METAL_LABEL)] as [Metal | "all", string][]}
        />
      </Field>
      <Field label="Category">
        <ChipRow
          value={category}
          onChange={(v) => patch({ category: v })}
          options={[["all", "All"], ...Object.entries(CATEGORY_LABEL)] as [Category | "all", string][]}
        />
      </Field>
      <Field label="Occasion">
        <ChipRow
          value={occasion}
          onChange={(v) => patch({ occasion: v })}
          options={[["all", "All"], ...Object.entries(OCCASION_LABEL)] as [Occasion | "all", string][]}
        />
      </Field>
      <Field label="Gemstone">
        <select value={gem} onChange={(e) => setGem(e.target.value)} className="sitara-select">
          <option value="all">All</option>
          {GEMSTONES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </Field>
      <Field label={`Up to ${maxLabel}`}>
        <input
          type="range"
          min={5000}
          max={2000000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-emerald"
        />
      </Field>
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Shop" }]} />
      <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-stone">The house</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl md:text-5xl">{q ? `“${q}”` : occasion !== "all" ? OCCASION_LABEL[occasion] : "Shop"}</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-11 rounded-lg border border-border px-3 text-sm md:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => patch({ sort: e.target.value })}
            className="h-11 rounded-lg border border-border bg-card px-3 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="best">Best selling</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>
      <p className="mt-2 text-sm text-stone">{list.length} pieces</p>
      <div className="mt-8 grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">{filters}</aside>
        {list.length === 0 ? (
          <p className="py-16 text-center text-sm text-stone">No pieces match those filters. Loosen a chip.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
      {filtersOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 md:hidden" onClick={() => setFiltersOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-auto rounded-t-2xl bg-ivory p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl">Filters</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} className="h-11 px-3 text-sm">
                Done
              </button>
            </div>
            {filters}
          </div>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-stone">{label}</p>
      {children}
    </div>
  );
}

function ChipRow<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "h-8 rounded-full px-3 text-xs capitalize",
            value === v ? "bg-emerald text-ivory" : "bg-ivory-deep text-ink",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
