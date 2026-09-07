import { createFileRoute } from "@tanstack/react-router";
import { PK_SIZES, circumferenceToPk, convertRingSize } from "@/lib/sizes";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/size-guide")({ component: SizeGuide });

function SizeGuide() {
  const [from, setFrom] = useState<"PK" | "UK" | "US">("UK");
  const [value, setValue] = useState("M");
  const [mm, setMm] = useState("54.4");
  const converted = convertRingSize(value, from);
  const fromMm = circumferenceToPk(Number(mm) || 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Fit</p>
      <h1 className="mt-2 font-display text-4xl">Ring size guide</h1>
      <p className="mt-3 text-ink-soft">
        Pakistani jewellers number from the inside circumference. Use the converter if you only know UK or US.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Convert</p>
          <select value={from} onChange={(e) => setFrom(e.target.value as "PK" | "UK" | "US")} className="sitara-select mt-3">
            <option value="PK">Pakistan</option>
            <option value="UK">United Kingdom</option>
            <option value="US">United States</option>
          </select>
          <Input className="mt-3" value={value} onChange={(e) => setValue(e.target.value)} />
          {converted && (
            <p className="mt-3 text-sm">
              PK {converted.pk} · UK {converted.uk} · US {converted.us} · {converted.mm} mm
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-border p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-stone">From a paper strip (mm)</p>
          <Input className="mt-3" value={mm} onChange={(e) => setMm(e.target.value)} />
          <p className="mt-3 text-sm">
            Closest PK {fromMm.pk} · UK {fromMm.uk} · US {fromMm.us}
          </p>
        </div>
      </div>
      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.14em] text-stone">
            <th className="py-2">PK</th>
            <th>UK</th>
            <th>US</th>
            <th>Circumference</th>
          </tr>
        </thead>
        <tbody>
          {PK_SIZES.map((s) => (
            <tr key={s.pk} className="border-t border-border">
              <td className="py-2">{s.pk}</td>
              <td>{s.uk}</td>
              <td>{s.us}</td>
              <td className="tabular-nums">{s.mm.toFixed(1)} mm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
