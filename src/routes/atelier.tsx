import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  staffStatus,
  claimAtelier,
  dashboard,
  listAllOrders,
  setOrderStatus,
  confirmPayment,
  listCatalogAdmin,
  saveProduct,
  listCustomers,
  listCoupons,
  saveCoupon,
  listEnquiries,
  listAbandoned,
  saveSettings,
  listReviewsAdmin,
  deleteReview,
} from "@/lib/server/admin";
import { formatPkr } from "@/lib/format";
import { NEXT_STATUS, STATUS_LABEL } from "@/lib/order";
import { COLLECTIONS, CATEGORY_LABEL, type Product, type Category, type Metal } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStorefront } from "@/components/storefront";
import type { OrderRow, ProfileRow, SettingsRow } from "@/lib/server/types";

export const Route = createFileRoute("/atelier")({
  component: Atelier,
  head: () => ({ meta: [{ title: "Atelier — Sitara" }] }),
});

type Tab =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "reviews"
  | "coupons"
  | "enquiries"
  | "settings";

function Atelier() {
  const { user, isPending } = useCurrentUserState();
  const [status, setStatus] = useState<{ isStaff: boolean; open: boolean; role: string | null } | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!user) return;
    staffStatus()
      .then(setStatus)
      .catch(() => setStatus({ isStaff: false, open: false, role: null }));
  }, [user]);

  if (isPending || (user && !status)) {
    return (
      <main className="px-4 py-16">
        <div className="h-40 animate-pulse rounded-2xl bg-ivory-deep" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  if (!status?.isStaff) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Private office</p>
        <h1 className="mt-2 font-display text-4xl">Atelier</h1>
        {status?.open ? (
          <>
            <p className="mt-4 text-sm text-ink-soft">This house has no keeper yet. Claiming it makes you the only merchant who can edit stock, prices, and orders.</p>
            <Button
              className="mt-6"
              onClick={async () => {
                await claimAtelier();
                setStatus({ isStaff: true, open: false, role: "owner" });
              }}
            >
              Claim the atelier
            </Button>
          </>
        ) : (
          <p className="mt-4 text-sm text-ink-soft">This office is private. Ask the keeper to add you as staff.</p>
        )}
      </main>
    );
  }

  const tabs: Tab[] = ["dashboard", "products", "orders", "customers", "reviews", "coupons", "enquiries", "settings"];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Private office · {status.role}</p>
      <h1 className="mt-2 font-display text-4xl">Atelier</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
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
      {tab === "dashboard" && <Dash />}
      {tab === "products" && <Products />}
      {tab === "orders" && <Orders />}
      {tab === "customers" && <Customers />}
      {tab === "reviews" && <Reviews />}
      {tab === "coupons" && <Coupons />}
      {tab === "enquiries" && <Enquiries />}
      {tab === "settings" && <Settings />}
    </main>
  );
}

function Dash() {
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboard>> | null>(null);
  useEffect(() => {
    dashboard().then(setData).catch(() => {});
  }, []);
  if (!data) return <p className="mt-8 text-sm text-stone">Loading desk…</p>;
  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Orders" value={String(data.orders)} />
        <Stat label="Revenue (placed)" value={formatPkr(data.revenue)} />
        <Stat label="Pending" value={String(data.pending)} />
        <Stat label="Abandoned bags" value={String(data.abandoned)} />
      </div>
      <p className="text-xs text-stone">Revenue is the sum of placed orders, including unpaid COD. It is not a bank balance.</p>
      <div>
        <h2 className="font-display text-2xl">Low stock</h2>
        <ul className="mt-3 text-sm">
          {data.lowStock.length === 0 && <li className="text-stone">None under 3.</li>}
          {data.lowStock.map((s) => (
            <li key={s.id}>
              {s.id} · {s.stock}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="font-display text-2xl">Events recorded</h2>
        <ul className="mt-3 text-sm">
          {data.events.length === 0 && <li className="text-stone">No analytics events yet.</li>}
          {data.events.map((e) => (
            <li key={e.name}>
              {e.name} · {e.n}
            </li>
          ))}
        </ul>
      </div>
      <Abandoned />
    </div>
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

function Abandoned() {
  const [rows, setRows] = useState<{ user_id: string; payload: string; updated_at: string }[]>([]);
  useEffect(() => {
    listAbandoned().then(setRows).catch(() => {});
  }, []);
  return (
    <div>
      <h2 className="font-display text-2xl">Abandoned bags</h2>
      <p className="mt-2 text-sm text-stone">Email recovery is not connected. These snapshots wait on the desk.</p>
      <ul className="mt-3 space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.user_id} className="rounded-lg border border-border p-3">
            {r.user_id} · {r.updated_at}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Products() {
  const { refresh } = useStorefront();
  const [products, setProducts] = useState<Product[]>([]);
  const [published, setPublished] = useState<Record<string, boolean>>({});
  const [edit, setEdit] = useState<Product | null>(null);
  const [stock, setStockVal] = useState(0);
  const [on, setOn] = useState(true);

  function reload() {
    listCatalogAdmin()
      .then((d) => {
        setProducts(d.products);
        setPublished(d.published);
      })
      .catch(() => {});
  }
  useEffect(() => {
    reload();
  }, []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Products</h2>
        <Button
          variant="outline"
          onClick={() =>
            setEdit({
              slug: "",
              name: "",
              collection: "everyday-gold",
              category: "ring",
              metal: "gold",
              karat: "22k",
              gemstone: null,
              occasion: ["everyday"],
              price: 0,
              weightG: 0,
              makingPkr: 0,
              hallmarked: true,
              antiTarnish: true,
              images: ["/products/dawn-stack.jpg"],
              description: "",
              details: [],
              completeTheLook: [],
              defaultStock: 1,
              sizeType: "none",
            })
          }
        >
          New piece
        </Button>
      </div>
      <table className="mt-4 w-full text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.14em] text-stone">
            <th className="py-2">Piece</th>
            <th>Price</th>
            <th>Live</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.slug} className="border-t border-border">
              <td className="py-3">
                <Link to="/shop/$slug" params={{ slug: p.slug }} className="font-display text-lg">
                  {p.name}
                </Link>
              </td>
              <td className="tabular-nums">{formatPkr(p.price)}</td>
              <td>{published[p.slug] === false ? "Hidden" : "Live"}</td>
              <td>
                <button
                  type="button"
                  className="text-xs uppercase tracking-[0.14em]"
                  onClick={() => {
                    setEdit(p);
                    setOn(published[p.slug] !== false);
                    setStockVal(p.defaultStock);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {edit && (
        <form
          className="mt-8 max-w-xl space-y-3 rounded-2xl border border-border bg-card p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            await saveProduct({ data: { product: edit, published: on, stock: stock } });
            refresh();
            setEdit(null);
            reload();
          }}
        >
          <h3 className="font-display text-2xl">{edit.slug ? "Edit" : "New piece"}</h3>
          <Input placeholder="Slug" value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} />
          <Input placeholder="Name" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
          <Input placeholder="Price PKR" type="number" value={edit.price} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })} />
          <Input placeholder="Stock" type="number" value={stock} onChange={(e) => setStockVal(Number(e.target.value))} />
          <select
            value={edit.collection}
            onChange={(e) => setEdit({ ...edit, collection: e.target.value })}
            className="sitara-select"
          >
            {COLLECTIONS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={edit.category}
            onChange={(e) => setEdit({ ...edit, category: e.target.value as Category })}
            className="sitara-select"
          >
            {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={edit.metal}
            onChange={(e) => setEdit({ ...edit, metal: e.target.value as Metal })}
            className="sitara-select"
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="plated">Plated</option>
          </select>
          <Input
            placeholder="Image path /products/…"
            value={edit.images[0] ?? ""}
            onChange={(e) => setEdit({ ...edit, images: [e.target.value] })}
          />
          <textarea
            value={edit.description}
            onChange={(e) => setEdit({ ...edit, description: e.target.value })}
            className="min-h-24 w-full rounded-lg border border-border bg-ivory p-3 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(edit.featured)} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(edit.newest)} onChange={(e) => setEdit({ ...edit, newest: e.target.checked })} /> New arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(edit.bestSeller)}
              onChange={(e) => setEdit({ ...edit, bestSeller: e.target.checked })}
            />{" "}
            Best seller
          </label>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="ghost" onClick={() => setEdit(null)}>
              Close
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<{ order_id: string; name: string; qty: number }[]>([]);
  function reload() {
    listAllOrders()
      .then((d) => {
        setOrders(d.orders);
        setItems(d.items);
      })
      .catch(() => {});
  }
  useEffect(() => {
    reload();
  }, []);
  return (
    <ul className="mt-8 space-y-3">
      {orders.length === 0 && <p className="text-sm text-stone">No orders yet.</p>}
      {orders.map((o) => (
        <li key={o.id} className="rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl">{o.id}</p>
              <p className="text-sm text-stone">
                {o.guest_name} · {o.city} · {o.phone} · {formatPkr(o.total)}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-stone">
                {STATUS_LABEL[o.status] ?? o.status} · {STATUS_LABEL[o.payment_status ?? ""] ?? o.payment_status}
              </p>
              <ul className="mt-2 text-sm">
                {items
                  .filter((it) => it.order_id === o.id)
                  .map((it) => (
                    <li key={it.name}>
                      {it.name} × {it.qty}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              {(NEXT_STATUS[o.status] ?? []).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await setOrderStatus({ data: { id: o.id, status: s } });
                    reload();
                  }}
                >
                  {STATUS_LABEL[s] ?? s}
                </Button>
              ))}
              {o.payment_status !== "paid" && o.payment_status !== "cod_pending" && (
                <Button
                  size="sm"
                  onClick={async () => {
                    await confirmPayment({ data: { id: o.id, paid: true } });
                    reload();
                  }}
                >
                  Mark paid
                </Button>
              )}
              {o.payment_status === "cod_pending" && (
                <Button
                  size="sm"
                  onClick={async () => {
                    await confirmPayment({ data: { id: o.id, paid: true } });
                    reload();
                  }}
                >
                  Cash collected
                </Button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Customers() {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  useEffect(() => {
    listCustomers().then(setRows).catch(() => {});
  }, []);
  return (
    <ul className="mt-8 space-y-2 text-sm">
      {rows.length === 0 && <p className="text-stone">No profiles yet.</p>}
      {rows.map((p) => (
        <li key={p.user_id} className="rounded-xl border border-border p-4">
          <p className="font-display text-xl">{p.display_name || p.user_id}</p>
          <p className="text-stone">
            {p.phone} · {p.city} · {p.coins} coins · {formatPkr(p.store_credit_pkr)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Reviews() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listReviewsAdmin>>>([]);
  function reload() {
    listReviewsAdmin().then(setRows).catch(() => {});
  }
  useEffect(() => {
    reload();
  }, []);
  return (
    <ul className="mt-8 space-y-3">
      {rows.length === 0 && <p className="text-sm text-stone">No reviews.</p>}
      {rows.map((r) => (
        <li key={r.id} className="rounded-xl border border-border p-4">
          <p className="font-display text-xl">{r.title}</p>
          <p className="text-sm text-ink-soft">{r.body}</p>
          <button type="button" className="mt-2 text-xs uppercase tracking-[0.14em] text-stone" onClick={() => deleteReview({ data: { id: r.id } }).then(reload)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

function Coupons() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listCoupons>>>([]);
  const [code, setCode] = useState("");
  const [value, setValue] = useState(10);
  const [kind, setKind] = useState<"percent" | "fixed" | "shipping">("percent");
  function reload() {
    listCoupons().then(setRows).catch(() => {});
  }
  useEffect(() => {
    reload();
  }, []);
  return (
    <div className="mt-8">
      <ul className="space-y-2 text-sm">
        {rows.map((c) => (
          <li key={c.code} className="rounded-xl border border-border p-4">
            <span className="font-mono">{c.code}</span> · {c.kind} {c.value} · used {c.uses}
            {c.active ? "" : " · off"}
          </li>
        ))}
      </ul>
      <form
        className="mt-6 max-w-md space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await saveCoupon({ data: { code, kind, value, min_subtotal: 0, active: true } });
          setCode("");
          reload();
        }}
      >
        <Input placeholder="CODE" value={code} onChange={(e) => setCode(e.target.value)} />
        <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="sitara-select">
          <option value="percent">Percent</option>
          <option value="fixed">Fixed PKR</option>
          <option value="shipping">Free shipping</option>
        </select>
        <Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
        <Button type="submit">Save coupon</Button>
      </form>
    </div>
  );
}

function Enquiries() {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listEnquiries>>>([]);
  useEffect(() => {
    listEnquiries().then(setRows).catch(() => {});
  }, []);
  return (
    <ul className="mt-8 space-y-3">
      {rows.length === 0 && <p className="text-sm text-stone">No notes yet.</p>}
      {rows.map((e) => (
        <li key={e.id} className="rounded-xl border border-border p-4">
          <p className="font-display text-xl">{e.name}</p>
          <p className="text-sm text-stone">
            {e.email} · {e.phone}
          </p>
          <p className="mt-2 text-sm">{e.message}</p>
        </li>
      ))}
    </ul>
  );
}

function Settings() {
  const { settings, refresh } = useStorefront();
  const [form, setForm] = useState<Partial<SettingsRow>>(settings);
  useEffect(() => {
    setForm(settings);
  }, [settings]);
  return (
    <form
      className="mt-8 max-w-lg space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await saveSettings({
          data: {
            cod_enabled: Boolean(form.cod_enabled),
            free_shipping_over: Number(form.free_shipping_over ?? 5000),
            gold_24k_tola_pkr: Number(form.gold_24k_tola_pkr ?? 352000),
            whatsapp_number: String(form.whatsapp_number ?? ""),
            bank_name: form.bank_name ?? "",
            bank_iban: form.bank_iban ?? "",
            bank_account_title: form.bank_account_title ?? "",
            raast_id: form.raast_id ?? "",
            jazzcash_merchant_id: form.jazzcash_merchant_id ?? "",
            easypaisa_store_id: form.easypaisa_store_id ?? "",
            card_public_key: form.card_public_key ?? "",
            hero_kicker: form.hero_kicker ?? "",
            hero_title: form.hero_title ?? "",
            hero_dek: form.hero_dek ?? "",
            gift_wrap_pkr: Number(form.gift_wrap_pkr ?? 650),
          },
        });
        refresh();
      }}
    >
      <label className="flex items-center justify-between rounded-xl border border-border p-4">
        <span>Cash on delivery</span>
        <input
          type="checkbox"
          checked={Boolean(form.cod_enabled)}
          onChange={(e) => setForm({ ...form, cod_enabled: e.target.checked })}
        />
      </label>
      <Field label="Free shipping over (PKR)" value={String(form.free_shipping_over ?? "")} onChange={(v) => setForm({ ...form, free_shipping_over: Number(v) })} />
      <Field label="WhatsApp" value={form.whatsapp_number ?? ""} onChange={(v) => setForm({ ...form, whatsapp_number: v })} />
      <Field label="Bank name" value={form.bank_name ?? ""} onChange={(v) => setForm({ ...form, bank_name: v })} />
      <Field label="IBAN" value={form.bank_iban ?? ""} onChange={(v) => setForm({ ...form, bank_iban: v })} />
      <Field label="Account title" value={form.bank_account_title ?? ""} onChange={(v) => setForm({ ...form, bank_account_title: v })} />
      <Field label="Raast id" value={form.raast_id ?? ""} onChange={(v) => setForm({ ...form, raast_id: v })} />
      <Field label="JazzCash merchant id" value={form.jazzcash_merchant_id ?? ""} onChange={(v) => setForm({ ...form, jazzcash_merchant_id: v })} />
      <Field label="Easypaisa store id" value={form.easypaisa_store_id ?? ""} onChange={(v) => setForm({ ...form, easypaisa_store_id: v })} />
      <Field label="Card public key" value={form.card_public_key ?? ""} onChange={(v) => setForm({ ...form, card_public_key: v })} />
      <p className="text-xs text-stone">Leave wallet and card fields empty to keep them disabled. Filling them does not mark orders paid — the desk confirms.</p>
      <Field label="Hero kicker" value={form.hero_kicker ?? ""} onChange={(v) => setForm({ ...form, hero_kicker: v })} />
      <Field label="Hero title" value={form.hero_title ?? ""} onChange={(v) => setForm({ ...form, hero_title: v })} />
      <textarea
        placeholder="Hero dek"
        value={form.hero_dek ?? ""}
        onChange={(e) => setForm({ ...form, hero_dek: e.target.value })}
        className="min-h-24 w-full rounded-lg border border-border bg-card p-3 text-sm"
      />
      <Button type="submit">Save settings</Button>
    </form>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      {label}
      <Input className="mt-1" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
