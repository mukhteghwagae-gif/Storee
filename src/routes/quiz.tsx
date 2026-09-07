import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { quizResult, type QuizAnswers } from "@/lib/recommendations";
import { useStorefront } from "@/components/storefront";
import { ProductCard } from "@/components/product-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quiz")({
  component: Quiz,
  head: () => ({ meta: [{ title: "Style quiz — Sitara" }] }),
});

function Quiz() {
  const { products, productBySlug } = useStorefront();
  const [a, setA] = useState<QuizAnswers>({ day: "office", metal: "yellow", voice: "quiet", budget: "daily" });
  const [done, setDone] = useState(false);
  const result = quizResult(a, products);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Breadcrumbs items={[{ label: "Style quiz" }]} />
      <h1 className="mt-6 font-display text-5xl">Jewellery style quiz</h1>
      <p className="mt-3 text-ink-soft">A short reading of the catalog. Not an algorithm with a marketing department.</p>
      <div className="mt-8 space-y-6">
        <Q label="Most days" value={a.day} onChange={(day) => setA({ ...a, day })} options={[["office", "Office"], ["home", "Home"], ["events", "Events"]]} />
        <Q label="Metal" value={a.metal} onChange={(metal) => setA({ ...a, metal })} options={[["yellow", "Yellow gold"], ["white", "White / silver"], ["rose", "Rose"]]} />
        <Q label="Voice" value={a.voice} onChange={(voice) => setA({ ...a, voice })} options={[["quiet", "Quiet"], ["one-piece", "One strong piece"], ["heirloom", "Heirloom"]]} />
        <Q label="Spend" value={a.budget} onChange={(budget) => setA({ ...a, budget })} options={[["daily", "Daily gold"], ["invest", "Invest"]]} />
      </div>
      <Button className="mt-8" onClick={() => setDone(true)}>
        Read my tray
      </Button>
      {done && (
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Your room</p>
          <h2 className="mt-2 font-display text-3xl">{result.title}</h2>
          <p className="mt-2 text-ink-soft">{result.dek}</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {result.slugs.map((s) => productBySlug[s] && <ProductCard key={s} product={productBySlug[s]} />)}
          </div>
          <Link to="/shop" className="mt-6 inline-block text-sm underline">
            Browse the house
          </Link>
        </section>
      )}
    </main>
  );
}

function Q<T extends string>({
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
