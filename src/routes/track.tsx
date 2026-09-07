import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { trackOrder } from "@/lib/server/commerce";
import { formatPkr } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/breadcrumbs";

type Search = { id?: string };

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: Track,
  head: () => ({ meta: [{ title: "Track an order — Sitara" }] }),
});

function Track() {
  const { id: initial } = Route.useSearch();
  const [id, setId] = useState(initial ?? "");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof trackOrder>> | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const data = await trackOrder({ data: { id, phone } });
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Not found");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <Breadcrumbs items={[{ label: "Track" }]} />
      <h1 className="mt-6 font-display text-4xl">Track a parcel</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Enter the order number or token and the mobile used at checkout. Live courier scans are not connected — you see the atelier’s desk status only.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <Input placeholder="ST-… or token" value={id} onChange={(e) => setId(e.target.value)} required />
        <Input placeholder="03XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Looking…" : "Look up"}
        </Button>
      </form>
      {result && (
        <section className="mt-10 rounded-2xl border border-border bg-card p-5">
          <p className="font-display text-2xl">{result.order.id}</p>
          <p className="mt-1 text-sm text-stone">
            {STATUS_LABEL[result.order.status] ?? result.order.status} · {STATUS_LABEL[result.order.payment_status ?? ""] ?? result.order.payment_status} · {formatPkr(result.order.total)}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {result.items.map((it) => (
              <li key={it.product_id + (it.size ?? "")}>
                {it.name} × {it.qty} · {formatPkr(it.unit_price)}
              </li>
            ))}
          </ul>
          <ol className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            {result.events.length === 0 && <li className="text-stone">No desk notes yet.</li>}
            {result.events.map((ev, i) => (
              <li key={i}>
                <span className="uppercase tracking-[0.12em] text-stone">{STATUS_LABEL[ev.status] ?? ev.status}</span>
                {ev.note ? ` · ${ev.note}` : ""}
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}
