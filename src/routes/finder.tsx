import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { giftFind, type FinderAnswers } from "@/lib/recommendations";
import { useStorefront } from "@/components/storefront";
import { ProductCard } from "@/components/product-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/finder")({
  component: Finder,
  head: () => ({ meta: [{ title: "Gift Finder — Sitara" }] }),
});

function Finder() {
  const { products } = useStorefront();
  const [a, setA] = useState<FinderAnswers>({
    budget: "under80",
    occasion: "everyday",
    wearer: "self",
    metal: "any",
  });
  const [shown, setShown] = useState(false);
  const found = giftFind(a, products);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ to: "/gifts", label: "Gifts" }, { label: "Finder" }]} />
      <h1 className="mt-6 font-display text-5xl">Gift Finder</h1>
      <p className="mt-3 text-ink-soft">Four questions. The catalog answers. No invented stock.</p>
      <div className="mt-8 space-y-6">
        <Choice
          label="Budget"
          value={a.budget}
          onChange={(budget) => setA({ ...a, budget })}
          options={[
            ["under20", "Under Rs 20,000"],
            ["under80", "Under Rs 80,000"],
            ["under3l", "Under Rs 3 lakh"],
            ["open", "Open"],
          ]}
        />
        <Choice
          label="Occasion"
          value={a.occasion}
          onChange={(occasion) => setA({ ...a, occasion })}
          options={[
            ["everyday", "Everyday"],
            ["office", "Office"],
            ["party", "Party"],
            ["bridal", "Bridal"],
          ]}
        />
        <Choice
          label="For"
          value={a.wearer}
          onChange={(wearer) => setA({ ...a, wearer })}
          options={[
            ["self", "Herself"],
            ["mother", "Mother"],
            ["sister", "Sister"],
            ["bride", "A bride"],
          ]}
        />
        <Choice
          label="Metal"
          value={a.metal}
          onChange={(metal) => setA({ ...a, metal })}
          options={[
            ["any", "Any"],
            ["gold", "Gold"],
            ["silver", "Silver"],
          ]}
        />
      </div>
      <Button className="mt-8" onClick={() => setShown(true)}>
        Show pieces
      </Button>
      {shown && (
        <div className="mt-10 grid grid-cols-2 gap-4">
          {found.length === 0 && <p className="col-span-2 text-sm text-stone">Nothing in the house matches. Loosen a question.</p>}
          {found.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

function Choice<T extends string>({
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
