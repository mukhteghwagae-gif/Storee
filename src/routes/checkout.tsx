import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CITIES, type City, type CourierId } from "@/lib/shipping";
import { formatPkr } from "@/lib/format";
import { hydrateLines, useSitara } from "@/lib/store";
import { placeGuestOrder, placeSignedOrder, previewQuote, previewSignedQuote, listMyAddresses, cancelGuestOrder } from "@/lib/server/commerce";
import { getOrCreateProfile } from "@/lib/server/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStorefront } from "@/components/storefront";
import { WHATSAPP_NUMBER } from "@/lib/catalog";
import { paymentOptions, type PaymentMethod } from "@/lib/payments";
import { STATUS_LABEL } from "@/lib/order";
import { trackEvent } from "@/lib/analytics";
import type { Quote } from "@/lib/quote";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — Sitara" }] }),
});

function Checkout() {
  const cart = useSitara((s) => s.cart);
  const clearCart = useSitara((s) => s.clearCart);
  const referralInput = useSitara((s) => s.referralInput);
  const setReferralInput = useSitara((s) => s.setReferralInput);
  const redeemCoins = useSitara((s) => s.redeemCoins);
  const setRedeemCoins = useSitara((s) => s.setRedeemCoins);
  const couponCode = useSitara((s) => s.couponCode);
  const setCouponCode = useSitara((s) => s.setCouponCode);
  const giftWrap = useSitara((s) => s.giftWrap);
  const setGiftWrap = useSitara((s) => s.setGiftWrap);
  const giftMessage = useSitara((s) => s.giftMessage);
  const setGiftMessage = useSitara((s) => s.setGiftMessage);
  const { productBySlug, settings, refresh } = useStorefront();
  const lines = hydrateLines(cart, productBySlug);
  const { user, isPending } = useCurrentUserState();

  const [city, setCity] = useState<City>("Lahore");
  const [courier, setCourier] = useState<CourierId>("leopard");
  const [pay, setPay] = useState<PaymentMethod>(settings.cod_enabled ? "cod" : "bank");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{
    id: string;
    total: number;
    payment_status: string;
    tracking_token: string;
    bank: { name?: string | null; iban?: string | null; title?: string | null; raast?: string | null } | null;
    merchant: string | null;
    cancelled?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Awaited<ReturnType<typeof listMyAddresses>>>([]);

  const methods = useMemo(() => paymentOptions(settings), [settings]);

  useEffect(() => {
    if (!user) return;
    getOrCreateProfile()
      .then((p) => {
        if (p?.phone) setPhone(p.phone);
        if (p?.address_line) setAddress(p.address_line);
        if (p?.city && (CITIES as readonly string[]).includes(p.city)) setCity(p.city as City);
        if (p?.display_name) setName(p.display_name);
        setCoins(p?.coins ?? 0);
      })
      .catch(() => {});
    listMyAddresses()
      .then(setAddresses)
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!methods.some((m) => m.id === pay && m.available)) {
      const first = methods.find((m) => m.available);
      if (first) setPay(first.id);
    }
  }, [methods, pay]);

  const payload = useMemo(
    () => ({
      items: lines.map(({ product, line }) => ({ slug: product.slug, qty: line.qty, size: line.size })),
      payment_method: pay,
      city,
      address_line: address || "placeholder-address-line",
      phone: phone || "03000000000",
      courier,
      name: name || "Guest",
      coupon: couponCode || undefined,
      gift_wrap: giftWrap,
      gift_message: giftMessage || undefined,
      redeem_coins: user ? redeemCoins : 0,
      referral_code: referralInput || undefined,
    }),
    [lines, pay, city, address, phone, courier, name, couponCode, giftWrap, giftMessage, redeemCoins, referralInput, user],
  );

  useEffect(() => {
    if (lines.length === 0) return;
    let cancelled = false;
    const t = window.setTimeout(() => {
      const previewQuoteFn = user ? previewSignedQuote : previewQuote;
      previewQuoteFn({ data: payload })
        .then((q) => {
          if (cancelled) return;
          setQuote(q);
          setQuoteError(null);
        })
        .catch((err) => {
          if (cancelled) return;
          setQuote(null);
          setQuoteError(err instanceof Error ? err.message : "Could not quote");
        });
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [payload, lines.length]);

  useEffect(() => {
    if (lines.length) trackEvent("checkout", { items: lines.length });
  }, [lines.length]);

  if (lines.length === 0 && !done) {
    return (
      <main className="px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <Button className="mt-6" asChild>
          <Link to="/shop">Shop</Link>
        </Button>
      </main>
    );
  }

  if (done) {
    const wa = `https://wa.me/${settings.whatsapp_number || WHATSAPP_NUMBER}?text=${encodeURIComponent(`Salaam Sitara, order ${done.id} totalling ${formatPkr(done.total)}. Token ${done.tracking_token}`)}`;
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Order received</p>
        <h1 className="mt-2 font-display text-4xl">{done.id}</h1>
        <p className="mt-3 text-ink-soft">
          {formatPkr(done.total)} · {STATUS_LABEL[done.payment_status] ?? done.payment_status}
        </p>
        <p className="mt-2 text-sm text-stone">Tracking token {done.tracking_token}. Nothing has been marked as paid.</p>
        {done.cancelled && <p className="mt-4 text-sm text-emerald">This order was cancelled. Stock is back on the tray.</p>}
        {done.bank?.iban && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-left text-sm">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Transfer to</p>
            <p className="mt-2">{done.bank.title}</p>
            <p>{done.bank.name}</p>
            <p className="font-mono">{done.bank.iban}</p>
            {done.bank.raast && <p>Raast · {done.bank.raast}</p>}
          </div>
        )}
        {done.merchant && (
          <p className="mt-4 text-sm text-ink-soft">Pay the atelier merchant {done.merchant}. The desk will confirm before packing.</p>
        )}
        <Button className="mt-8" asChild>
          <a href={wa} target="_blank" rel="noreferrer">
            Send on WhatsApp
          </a>
        </Button>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <Link to="/track" search={{ id: done.id }} className="underline">
            Track parcel
          </Link>
          {user && (
            <Link to="/account" className="underline">
              Your orders
            </Link>
          )}
        </div>
        {!user && !done.cancelled && (
          <button
            type="button"
            className="mt-6 text-xs uppercase tracking-[0.14em] text-stone underline"
            onClick={async () => {
              try {
                await cancelGuestOrder({ data: { id: done.id, phone } });
                setDone({ ...done, cancelled: true });
              } catch (err) {
                setError(err instanceof Error ? err.message : "Could not cancel");
              }
            }}
          >
            Cancel this pending order
          </button>
        )}
      </main>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const body = {
        items: lines.map(({ product, line }) => ({ slug: product.slug, qty: line.qty, size: line.size })),
        payment_method: pay,
        city,
        address_line: address,
        phone,
        courier,
        name,
        coupon: couponCode || undefined,
        gift_wrap: giftWrap,
        gift_message: giftMessage || undefined,
        redeem_coins: user ? redeemCoins : 0,
        referral_code: referralInput || undefined,
      };
      const res = user ? await placeSignedOrder({ data: body }) : await placeGuestOrder({ data: body });
      trackEvent("purchase", { id: res.id, total: res.total, method: pay });
      clearCart();
      refresh();
      setDone({
        id: res.id,
        total: res.total,
        payment_status: res.payment_status,
        tracking_token: res.tracking_token,
        bank: res.bank,
        merchant: res.merchant ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_320px]">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-display text-4xl">Checkout</h1>
        {!isPending && !user && (
          <p className="rounded-lg bg-ivory-deep px-3 py-2 text-sm">
            Guest checkout is saved on the atelier desk.{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>{" "}
            to earn coins and keep addresses.
          </p>
        )}
        {addresses.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Saved addresses</p>
            {addresses.map((a) => (
              <button
                key={a.id}
                type="button"
                className="w-full rounded-lg border border-border px-3 py-3 text-left text-sm"
                onClick={() => {
                  setAddress(a.address_line);
                  if (a.city && (CITIES as readonly string[]).includes(a.city)) setCity(a.city as City);
                  if (a.phone) setPhone(a.phone);
                  if (a.name) setName(a.name);
                }}
              >
                <span className="font-medium">{a.label}</span>
                <span className="mt-1 block text-stone">
                  {a.address_line}, {a.city}
                </span>
              </button>
            ))}
          </div>
        )}
        <Input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input required placeholder="03XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input required placeholder="House, street, mohalla" value={address} onChange={(e) => setAddress(e.target.value)} />
        <select value={city} onChange={(e) => setCity(e.target.value as City)} className="sitara-select">
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {(["leopard", "tcs", "call"] as CourierId[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCourier(c)}
              className={`h-10 rounded-lg border px-3 text-xs uppercase tracking-[0.12em] ${courier === c ? "border-ink bg-ink text-ivory" : "border-border"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Pay</p>
        <div className="grid gap-2">
          {methods.map((p) => (
            <label
              key={p.id}
              className={`rounded-lg border px-3 py-3 ${pay === p.id ? "border-ink" : "border-border"} ${!p.available ? "opacity-50" : ""}`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="pay"
                  disabled={!p.available}
                  checked={pay === p.id}
                  onChange={() => setPay(p.id)}
                />
                <span>{p.label}</span>
                {!p.configured && <span className="ml-auto text-[10px] uppercase tracking-[0.14em] text-stone">Not connected</span>}
              </span>
              <span className="mt-1 block pl-7 text-xs text-stone">{p.hint}</span>
            </label>
          ))}
        </div>
        <label className="flex items-center gap-3 rounded-lg border border-border px-3 py-3 text-sm">
          <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} />
          Cedar gift wrap · {formatPkr(settings.gift_wrap_pkr ?? 650)}
        </label>
        {giftWrap && (
          <Input placeholder="Gift message (optional)" value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)} />
        )}
        <Input
          placeholder="Coupon"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />
        {user && coins > 0 && (
          <label className="block text-sm">
            Redeem gold coins ({coins} available)
            <input
              type="range"
              min={0}
              max={coins}
              value={redeemCoins}
              onChange={(e) => setRedeemCoins(Number(e.target.value))}
              className="mt-2 w-full accent-emerald"
            />
          </label>
        )}
        <Input
          placeholder="Referral code (SITARA-…)"
          value={referralInput}
          onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
        />
        {(error || quoteError) && <p className="text-sm text-destructive">{error || quoteError}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={busy || !quote}>
          {busy ? "Placing…" : `Place order · ${formatPkr(quote?.total ?? 0)}`}
        </Button>
        <p className="text-[11px] text-stone">
          Totals are calculated on the atelier desk. Online wallets stay unpaid until the merchant account is connected and the desk confirms.
        </p>
      </form>
      <aside className="h-fit rounded-2xl border border-border bg-card p-5">
        {lines.map(({ product, line }) => (
          <div key={`${product.slug}-${line.size ?? ""}`} className="mb-3 flex justify-between gap-3 text-sm">
            <span>
              {product.name} × {line.qty}
            </span>
            <span className="tabular-nums">{formatPkr(product.price * line.qty)}</span>
          </div>
        ))}
        <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
          <Row label="Subtotal" value={formatPkr(quote?.subtotal ?? 0)} />
          {(quote?.stackDiscount ?? 0) > 0 && <Row label="Stack courtesy" value={`−${formatPkr(quote!.stackDiscount)}`} />}
          {(quote?.couponDiscount ?? 0) > 0 && <Row label={quote?.couponCode ?? "Coupon"} value={`−${formatPkr(quote!.couponDiscount)}`} />}
          {(quote?.coinDiscount ?? 0) > 0 && <Row label="Coins" value={`−${formatPkr(quote!.coinDiscount)}`} />}
          <Row label="Shipping" value={quote?.shipping === 0 ? "Free" : formatPkr(quote?.shipping ?? 0)} />
          {(quote?.giftWrap ?? 0) > 0 && <Row label="Gift wrap" value={formatPkr(quote!.giftWrap)} />}
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-medium">
          <span>Total</span>
          <span className="tabular-nums">{formatPkr(quote?.total ?? 0)}</span>
        </div>
        <p className="mt-3 text-[11px] text-stone">
          {quote ? `${quote.shippingLabel} · ${quote.days} days` : "Quoting…"} · GST shown when FBR requires it.
        </p>
      </aside>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-stone">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
