import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { formatPkr } from "@/lib/format";
import { useSitara } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStorefront } from "@/components/storefront";

export const Route = createFileRoute("/stack")({ component: StackPage });

function StackPage() {
  const { products } = useStorefront();
  const stackable = products.filter((p) => p.stackable && (p.category === "ring" || p.category === "bangle"));
  const [picked, setPicked] = useState<string[]>(["dawn-stack", "whisper-bangle"]);
  const addToCart = useSitara((s) => s.addToCart);

  const items = picked.map((s) => stackable.find((p) => p.slug === s)!).filter(Boolean);
  const sub = items.reduce((s, p) => s + p.price, 0);
  const bundle = items.length >= 3 ? Math.round(sub * 0.9) : sub;
  const saved = sub - bundle;

  function toggle(slug: string) {
    setPicked((cur) => {
      if (cur.includes(slug)) return cur.filter((s) => s !== slug);
      if (cur.length >= 3) return [...cur.slice(1), slug];
      return [...cur, slug];
    });
  }

  const offsets = useMemo(() => [-18, 0, 18], []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Configurator</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">Build your stack</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Choose up to three rings or bangles. Three together take ten percent off — the atelier’s only bundle.
      </p>
      <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-ivory-deep">
          <img src="/editorial/hand-stack.jpg" alt="Hand" className="aspect-[4/3] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2">
            {items.map((p, i) => (
              <img
                key={p.slug}
                src={p.overlay ?? p.images[0]}
                alt={p.name}
                className="h-16 w-16 rounded-full object-cover shadow-sitara"
                style={{ transform: `translateY(${offsets[i] ?? 0}px)` }}
              />
            ))}
          </div>
        </div>
        <div>
          <ul className="space-y-2">
            {stackable.map((p) => {
              const on = picked.includes(p.slug);
              return (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => toggle(p.slug)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3 text-left",
                      on ? "border-emerald bg-card" : "border-border",
                    )}
                  >
                    <img src={p.images[0]} alt="" className="size-14 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="font-display text-lg leading-tight">{p.name}</p>
                      <p className="text-xs uppercase tracking-[0.14em] text-stone">{p.category}</p>
                    </div>
                    <span className="text-sm tabular-nums">{formatPkr(p.price)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPkr(sub)}</span>
            </div>
            {saved > 0 && (
              <div className="mt-1 flex justify-between text-sm text-emerald">
                <span>Stack of three</span>
                <span>−{formatPkr(saved)}</span>
              </div>
            )}
            <div className="mt-2 flex justify-between font-medium">
              <span>Bag total</span>
              <span className="tabular-nums">{formatPkr(bundle)}</span>
            </div>
            <Button
              className="mt-4 w-full"
              disabled={items.length === 0}
              onClick={() => items.forEach((p) => addToCart(p.slug))}
            >
              Add stack to bag
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
