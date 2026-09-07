import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getOrCreateProfile, listMyOrders, updateProfile, type OrderRow, type ProfileRow } from "@/lib/server/store";
import { cancelMyOrder, requestReturn, listMyAddresses, saveAddress, deleteAddress } from "@/lib/server/commerce";
import { formatPkr } from "@/lib/format";
import { useSitara } from "@/lib/store";
import { useStorefront } from "@/components/storefront";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { REFERRAL_CREDIT_PKR } from "@/lib/loyalty";
import { STATUS_LABEL, canCancel, canRequestReturn } from "@/lib/order";
import { CITIES } from "@/lib/shipping";

export const Route = createFileRoute("/account")({
  component: Account,
  head: () => ({ meta: [{ title: "Account — Sitara" }] }),
});

function Account() {
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<{ order_id: string; name: string; qty: number; unit_price: number }[]>([]);
  const [tab, setTab] = useState<"orders" | "addresses" | "saved" | "rewards">("orders");
  const wishlist = useSitara((s) => s.wishlist);
  const { productBySlug } = useStorefront();
  const [copied, setCopied] = useState(false);

  function reload() {
    getOrCreateProfile()
      .then(setProfile)
      .catch(() => {});
    listMyOrders()
      .then((d) => {
        setOrders(d.orders);
        setItems(d.items);
      })
      .catch(() => {});
  }

  useEffect(() => {
    if (!user) return;
    reload();
  }, [user]);

  if (isPending) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="h-40 animate-pulse rounded-2xl bg-ivory-deep" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Account</p>
      <h1 className="mt-2 font-display text-4xl">{profile?.display_name || user.displayName || "Collector"}</h1>
      <p className="mt-1 text-sm text-stone">{user.primaryEmail}</p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Gold coins" value={String(profile?.coins ?? 0)} />
        <Stat label="Store credit" value={formatPkr(profile?.store_credit_pkr ?? 0)} />
        <Stat label="Orders" value={String(orders.length)} />
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        {(["orders", "addresses", "saved", "rewards"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`h-10 rounded-full px-4 text-xs uppercase tracking-[0.14em] ${tab === t ? "bg-emerald text-ivory" : "bg-ivory-deep"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <section className="mt-8">
          <h2 className="font-display text-2xl">Orders</h2>
          {orders.length === 0 && <p className="mt-3 text-sm text-stone">No parcels yet.</p>}
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="rounded-xl border border-border p-4">
                <div className="flex justify-between gap-3">
                  <span className="font-display text-xl">{o.id}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-stone">{STATUS_LABEL[o.status] ?? o.status}</span>
                </div>
                <p className="mt-1 text-sm tabular-nums">
                  {formatPkr(o.total)} · {o.payment_method} · {STATUS_LABEL[o.payment_status ?? ""] ?? o.payment_status} · {o.city}
                </p>
                <ul className="mt-2 text-sm text-ink-soft">
                  {items
                    .filter((it) => it.order_id === o.id)
                    .map((it) => (
                      <li key={it.name}>
                        {it.name} × {it.qty}
                      </li>
                    ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to="/track" search={{ id: o.id }} className="text-xs uppercase tracking-[0.14em] underline">
                    Track
                  </Link>
                  {canCancel(o.status) && (
                    <button
                      type="button"
                      className="text-xs uppercase tracking-[0.14em] underline"
                      onClick={async () => {
                        await cancelMyOrder({ data: { id: o.id } });
                        reload();
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  {canRequestReturn(o.status) && (
                    <button
                      type="button"
                      className="text-xs uppercase tracking-[0.14em] underline"
                      onClick={async () => {
                        const reason = window.prompt("Why are you returning?");
                        if (!reason) return;
                        await requestReturn({ data: { id: o.id, reason } });
                        reload();
                      }}
                    >
                      Request return
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "addresses" && (
        <>
          <ProfileForm profile={profile} onSaved={setProfile} />
          <Addresses />
        </>
      )}

      {tab === "saved" && (
        <section className="mt-8">
          <h2 className="font-display text-2xl">Wishlist</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {wishlist.map((slug) => {
              const p = productBySlug[slug];
              if (!p) return null;
              return (
                <Link key={slug} to="/shop/$slug" params={{ slug }} className="flex gap-3">
                  <img src={p.images[0]} alt="" className="size-16 rounded-md object-cover" />
                  <span className="font-display text-lg leading-tight">{p.name}</span>
                </Link>
              );
            })}
            {wishlist.length === 0 && <p className="text-sm text-stone">Nothing saved.</p>}
          </div>
        </section>
      )}

      {tab === "rewards" && (
        <section className="mt-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-2xl">Refer a friend</h2>
          <p className="mt-2 text-sm text-ink-soft">
            She places her first order with your code. You receive {formatPkr(REFERRAL_CREDIT_PKR)} credit.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-ivory-deep px-3 py-3 text-sm">{profile?.referral_code ?? "…"}</code>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!profile?.referral_code) return;
                void navigator.clipboard.writeText(profile.referral_code);
                setCopied(true);
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-stone">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
    </div>
  );
}

function ProfileForm({
  profile,
  onSaved,
}: {
  profile: ProfileRow | null;
  onSaved: (p: ProfileRow) => void;
}) {
  const [display_name, setName] = useState(profile?.display_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [address_line, setAddress] = useState(profile?.address_line ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  useEffect(() => {
    setName(profile?.display_name ?? "");
    setPhone(profile?.phone ?? "");
    setAddress(profile?.address_line ?? "");
    setCity(profile?.city ?? "");
  }, [profile]);
  return (
    <form
      className="mt-8 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const p = await updateProfile({ data: { display_name, phone, address_line, city } });
        if (p) onSaved(p);
      }}
    >
      <h2 className="font-display text-2xl">Details</h2>
      <Input placeholder="Name" value={display_name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input placeholder="Address" value={address_line} onChange={(e) => setAddress(e.target.value)} />
      <select value={city} onChange={(e) => setCity(e.target.value)} className="sitara-select">
        <option value="">City</option>
        {CITIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <Button type="submit">Save</Button>
    </form>
  );
}

function Addresses() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listMyAddresses>>>([]);
  const [label, setLabel] = useState("Home");
  const [line, setLine] = useState("");
  const [city, setCity] = useState("Lahore");
  const reload = () => listMyAddresses().then(setRows).catch(() => {});
  useEffect(() => {
    reload();
  }, []);
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl">Addresses</h2>
      <ul className="mt-4 space-y-2">
        {rows.map((a) => (
          <li key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-4 text-sm">
            <div>
              <p className="font-medium">{a.label}</p>
              <p className="text-ink-soft">
                {a.address_line}, {a.city}
              </p>
            </div>
            <button type="button" className="text-xs uppercase tracking-[0.14em] text-stone" onClick={() => deleteAddress({ data: { id: a.id } }).then(reload)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <form
        className="mt-4 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await saveAddress({ data: { label, address_line: line, city, is_default: rows.length === 0 } });
          setLine("");
          reload();
        }}
      >
        <Input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <Input placeholder="Address" value={line} onChange={(e) => setLine(e.target.value)} />
        <select value={city} onChange={(e) => setCity(e.target.value)} className="sitara-select">
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Button type="submit" variant="outline">
          Add address
        </Button>
      </form>
    </section>
  );
}
