import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSitara } from "@/lib/store";
import { Button } from "./ui/button";
import { joinList } from "@/lib/server/commerce";

export function PromoLayer() {
  const setCouponCode = useSitara((s) => s.setCouponCode);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("sitara-welcome")) return;
    const t = window.setTimeout(() => setOpen(true), 18000);
    return () => window.clearTimeout(t);
  }, []);

  function close() {
    setOpen(false);
    localStorage.setItem("sitara-welcome", "1");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/40 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-ivory p-6 shadow-sitara">
        <button type="button" className="absolute right-2 top-2 grid size-11 place-items-center" onClick={close} aria-label="Close">
          <X className="size-4" />
        </button>
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">The list</p>
        <h2 className="mt-2 font-display text-3xl">A quiet courtesy</h2>
        <p className="mt-2 text-sm text-ink-soft">
          STARLIGHT10 — ten percent, applied at checkout if the desk still honours it. No mail leaves until a provider is connected.
        </p>
        {claimed ? (
          <p className="mt-4 text-sm text-emerald">You are on the list. The code is saved for checkout.</p>
        ) : (
          <form
            className="mt-4 flex flex-col gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email.includes("@")) return;
              await joinList({ data: { email } }).catch(() => {});
              setCouponCode("STARLIGHT10");
              setClaimed(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-11 rounded-lg border border-border bg-card px-3 text-sm"
            />
            <Button type="submit">Join the list</Button>
          </form>
        )}
      </div>
    </div>
  );
}
