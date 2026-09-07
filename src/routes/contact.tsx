import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { sendEnquiry } from "@/lib/server/commerce";
import { WHATSAPP_NUMBER } from "@/lib/catalog";
import { useStorefront } from "@/components/storefront";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — Sitara" }] }),
});

function Contact() {
  const { settings } = useStorefront();
  const wa = settings.whatsapp_number || WHATSAPP_NUMBER;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await sendEnquiry({ data: { name, email, phone, message } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-2">
      <div>
        <Breadcrumbs items={[{ label: "Contact" }]} />
        <h1 className="mt-6 font-display text-5xl">The desk</h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
          Sitara is a Lahore house. Write, or WhatsApp. We do not pretend a mail server is connected — your note is stored for the atelier and you may copy it to WhatsApp in one tap.
        </p>
        <a
          href={`https://wa.me/${wa}`}
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-emerald px-5 text-sm text-ivory"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp the atelier
        </a>
        <p className="mt-8 text-sm text-stone">Tuesdays, by appointment, old city light. GST invoice on request.</p>
      </div>
      {done ? (
        <p className="self-center font-display text-3xl">Received. We will answer on WhatsApp if you left a number.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <Input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="03XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How may we help?"
            className="min-h-36 w-full rounded-lg border border-border bg-card p-3 text-sm"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={busy}>
            {busy ? "Sending…" : "Leave a note"}
          </Button>
        </form>
      )}
    </main>
  );
}
