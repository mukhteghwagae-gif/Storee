import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { matchLook, type MatchAnswers } from "@/lib/recommendations";
import { useStorefront } from "@/components/storefront";
import { ProductCard } from "@/components/product-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/match")({
  component: Match,
  head: () => ({ meta: [{ title: "Outfit matcher — Sitara" }] }),
});

function Match() {
  const { products } = useStorefront();
  const [a, setA] = useState<MatchAnswers>({ occasion: "everyday", palette: "warm", neckline: "open" });
  const [shown, setShown] = useState(false);
  const found = matchLook(a, products);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Outfit matcher" }]} />
      <h1 className="mt-6 font-display text-5xl">Outfit & colour matcher</h1>
      <p className="mt-3 text-ink-soft">Warm gold on ivory. Cool silver on midnight. A blush chain on rose silk.</p>
      <div className="mt-8 space-y-6">
        <Row
          label="Occasion"
          value={a.occasion}
          onChange={(occasion) => setA({ ...a, occasion })}
          options={[["everyday", "Everyday"], ["office", "Office"], ["party", "Party"], ["bridal", "Bridal"]]}
        />
        <Row
          label="Cloth colour"
          value={a.palette}
          onChange={(palette) => setA({ ...a, palette })}
          options={[["warm", "Warm / ivory / mustard"], ["cool", "Cool / black / ice"], ["blush", "Blush / rose"]]}
        />
        <Row
          label="Neckline"
          value={a.neckline}
          onChange={(neckline) => setA({ ...a, neckline })}
          options={[["open", "Open"], ["high", "High / collared"], ["none", "No necklace"]]}
        />
      </div>
      <Button className="mt-8" onClick={() => setShown(true)}>
        Match
      </Button>
      {shown && (
        <div className="mt-10 grid grid-cols-2 gap-4">
          {found.length === 0 && <p className="col-span-2 text-sm text-stone">No exact match. Try another colour.</p>}
          {found.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

function Row<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-stone">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={cn("h-10 rounded-full px-4 text-sm", value === v ? "bg-emerald text-ivory" : "bg-ivory-deep")}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
