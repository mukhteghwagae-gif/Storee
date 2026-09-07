import { useState, type FormEvent } from "react";
import { joinList } from "@/lib/server/commerce";
import { Button } from "./ui/button";

export function NewsletterForm({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await joinList({ data: { email } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join");
    } finally {
      setBusy(false);
    }
  }

  if (done) return <p className="text-sm text-emerald">You are on the list. No welcome email is sent until the desk is connected.</p>;

  return (
    <form onSubmit={onSubmit} className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}>
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="h-11 flex-1 rounded-lg border border-border bg-ivory px-3 text-sm"
      />
      <Button type="submit" size="md" disabled={busy}>
        {busy ? "Joining…" : "Join"}
      </Button>
      {error && <p className="w-full text-sm text-destructive">{error}</p>}
    </form>
  );
}
