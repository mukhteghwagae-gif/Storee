import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({ component: Returns });

function Returns() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl">Returns</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
        <p>Seven days, unworn, in the Sitara box, with the hallmark intact. We refund to the original method, or as store credit if you prefer speed.</p>
        <p>Bridal sets may be resized once within thirty days. Custom kundan is not returnable unless the work is at fault.</p>
        <p>Cash-on-delivery returns are collected by Leopard or TCS. Photograph the piece before handing it over.</p>
        <p>Hallmarked gold is weighed on return. Making charges are non-refundable if the piece has been worn to an event.</p>
      </div>
    </main>
  );
}
