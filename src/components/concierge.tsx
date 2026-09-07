import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MessageSquareText, Send, X } from "lucide-react";
import { askConcierge } from "@/lib/server/store";
import { Button } from "./ui/button";

type Msg = { role: "user" | "assistant"; content: string };

export function Concierge() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hide =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/atelier") ||
    (pathname.startsWith("/shop/") && pathname !== "/shop" && pathname !== "/shop/");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content: "I am the Sitara concierge. Ask me if a piece is anti-tarnish, 22k, or in stock.",
    },
  ]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setBusy(true);
    const res = await askConcierge({
      data: {
        message: text,
        history: next.filter((m) => m.role !== "assistant" || next.indexOf(m) > 0).slice(-6),
      },
    }).catch(() => ({ ok: false as const, error: "Unavailable" }));
    setBusy(false);
    setMsgs([
      ...next,
      {
        role: "assistant",
        content: res.ok ? res.text : (res.error ?? "WhatsApp us — the desk will answer."),
      },
    ]);
  }

  if (hide) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Concierge"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-4 z-30 grid size-12 place-items-center rounded-full border border-border bg-ivory text-ink shadow-sitara md:bottom-6"
      >
        <MessageSquareText className="size-5" />
      </button>
      {open && (
        <div className="fixed bottom-24 left-4 z-40 flex h-[28rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-border bg-ivory shadow-sitara md:bottom-24">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-display text-xl">Concierge</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-stone">Trained on the catalog</p>
            </div>
            <button type="button" className="grid size-10 place-items-center" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-4 text-sm">
            {msgs.map((m, i) => (
              <p
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-xl bg-emerald px-3 py-2 text-ivory"
                    : "mr-6 rounded-xl bg-ivory-deep px-3 py-2 text-ink"
                }
              >
                {m.content}
              </p>
            ))}
            {busy && <p className="text-xs text-stone">Looking through the trays…</p>}
          </div>
          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Is this anti-tarnish?"
              className="h-11 flex-1 rounded-lg border border-border bg-card px-3 text-sm"
            />
            <Button type="submit" size="icon" disabled={busy}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
