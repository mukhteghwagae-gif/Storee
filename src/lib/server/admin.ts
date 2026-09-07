import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Product } from "@/lib/catalog";
import { NEXT_STATUS, shipmentForOrderStatus } from "@/lib/order";
import { restock } from "./commerce";
import { loadCatalog } from "./catalog-db";
import type { OrderRow, ProfileRow, SettingsRow } from "./types";

async function requireStaff(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ user_id: string; role: string }>`select user_id, role from staff where user_id = ${userId}`;
  if (!rows[0]) throw new Error("Forbidden");
  return { sql, role: rows[0].role };
}

export const staffStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const mine = await sql<{ user_id: string; role: string }>`
      select user_id, role from staff where user_id = ${context.userId}
    `;
    const countRows = await sql<{ n: number }>`select count(*)::int as n from staff`;
    return { isStaff: Boolean(mine[0]), role: mine[0]?.role ?? null, open: (countRows[0]?.n ?? 0) === 0 };
  });

export const claimAtelier = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const inserted = await sql<{ user_id: string; role: string }>`
      insert into staff (user_id, role)
      select ${context.userId}, 'owner'
      where not exists (select 1 from staff)
      returning user_id, role
    `;
    if (!inserted[0]) throw new Error("This atelier already has a keeper.");
    return { ok: true as const, role: "owner" as const };
  });

export const addStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { user_id: string; role?: string }) => input)
  .handler(async ({ context, data }) => {
    const { sql, role } = await requireStaff(context.userId);
    if (role !== "owner") throw new Error("Only the keeper can add staff.");
    const uid = data.user_id.trim();
    if (uid.length < 3) throw new Error("Need a user id.");
    await sql`
      insert into staff (user_id, role) values (${uid}, 'admin')
      on conflict (user_id) do nothing
    `;
    return { ok: true as const };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    return sql<{ user_id: string; role: string; created_at: string }>`
      select user_id, role, created_at from staff order by created_at
    `;
  });

export const listAllOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    const orders = await sql<OrderRow>`select * from orders order by created_at desc limit 200`;
    const items = await sql<{
      order_id: string;
      product_id: string;
      name: string;
      size: string | null;
      qty: number;
      unit_price: number;
    }>`select order_id, product_id, name, size, qty, unit_price from order_items`;
    return { orders, items };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; status: string; note?: string }) => input)
  .handler(async ({ context, data }) => {
    const { sql } = await requireStaff(context.userId);
    const rows = await sql<OrderRow>`select * from orders where id = ${data.id}`;
    const order = rows[0];
    if (!order) throw new Error("Order not found.");
    const allowed = NEXT_STATUS[order.status] ?? [];
    if (!allowed.includes(data.status)) throw new Error(`Cannot move ${order.status} to ${data.status}.`);
    const ship = shipmentForOrderStatus(data.status);
    if (data.status === "cancelled" || data.status === "returned") await restock(sql, order.id);
    await sql`
      update orders set
        status = ${data.status},
        shipment_status = coalesce(${ship}, shipment_status),
        payment_status = case
          when ${data.status} = 'refunded' then 'refunded'
          else payment_status
        end,
        cancelled_at = case when ${data.status} = 'cancelled' then now() else cancelled_at end
      where id = ${order.id}
    `;
    await sql`
      insert into order_events (order_id, status, note)
      values (${order.id}, ${data.status}, ${data.note?.slice(0, 200) ?? null})
    `;
    return { ok: true as const };
  });

export const confirmPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; paid: boolean }) => input)
  .handler(async ({ context, data }) => {
    const { sql } = await requireStaff(context.userId);
    await sql`
      update orders
      set payment_status = ${data.paid ? "paid" : "failed"},
          status = case when ${data.paid} and status = 'pending' then 'confirmed' else status end
      where id = ${data.id}
        and status not in ('cancelled', 'refunded', 'returned')
    `;
    await sql`
      insert into order_events (order_id, status, note)
      values (${data.id}, ${data.paid ? "confirmed" : "failed"}, ${data.paid ? "payment confirmed" : "payment failed"})
    `;
    return { ok: true as const };
  });

export const dashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    const orders = await sql<{ n: number; revenue: number }>`
      select count(*)::int as n, coalesce(sum(total), 0)::int as revenue from orders where status <> 'cancelled'
    `;
    const pending = await sql<{ n: number }>`select count(*)::int as n from orders where status = 'pending'`;
    const low = await sql<{ id: string; stock: number }>`
      select id, stock from product_stock where stock <= 3 order by stock
    `;
    const events = await sql<{ name: string; n: number }>`
      select name, count(*)::int as n from analytics_events group by name order by n desc
    `;
    const abandoned = await sql<{ n: number }>`select count(*)::int as n from cart_snapshots`;
    const subscribers = await sql<{ n: number }>`select count(*)::int as n from newsletter_subscribers`;
    return {
      orders: orders[0]?.n ?? 0,
      revenue: orders[0]?.revenue ?? 0,
      pending: pending[0]?.n ?? 0,
      lowStock: low,
      events,
      abandoned: abandoned[0]?.n ?? 0,
      subscribers: subscribers[0]?.n ?? 0,
    };
  });

export const listCatalogAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    const products = await loadCatalog(sql, false);
    const published = await sql<{ slug: string; published: boolean }>`select slug, published from catalog_products`;
    const stock = await sql<{ id: string; stock: number; sold_count: number }>`
      select id, stock, sold_count from product_stock
    `;
    return {
      products,
      published: Object.fromEntries(published.map((p) => [p.slug, p.published])),
      stock,
    };
  });

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { product: Product; published: boolean; stock?: number }) => input)
  .handler(async ({ context, data }) => {
    const { sql } = await requireStaff(context.userId);
    const p = data.product;
    if (!p.slug || !p.name || p.price < 0) throw new Error("Name, slug and price are required.");
    const slug = p.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    p.slug = slug;
    await sql`
      insert into catalog_products (slug, payload, published, updated_at)
      values (${slug}, ${JSON.stringify(p)}, ${data.published}, now())
      on conflict (slug) do update set payload = excluded.payload, published = excluded.published, updated_at = now()
    `;
    if (typeof data.stock === "number") {
      const stock = Math.max(0, Math.round(data.stock));
      await sql`
        insert into product_stock (id, stock) values (${slug}, ${stock})
        on conflict (id) do update set stock = ${stock}
      `;
    }
    return { ok: true as const, slug };
  });

export const listCustomers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    return sql<ProfileRow>`select * from profiles order by created_at desc limit 200`;
  });

export const listCoupons = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    return sql<{
      code: string;
      kind: string;
      value: number;
      min_subtotal: number;
      max_uses: number | null;
      uses: number;
      active: boolean;
      note: string | null;
    }>`select * from coupons order by code`;
  });

export const saveCoupon = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      code: string;
      kind: "percent" | "fixed" | "shipping";
      value: number;
      min_subtotal: number;
      max_uses?: number | null;
      active: boolean;
      note?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const { sql } = await requireStaff(context.userId);
    const code = data.code.trim().toUpperCase().replace(/\s+/g, "");
    if (code.length < 3) throw new Error("Code is too short.");
    await sql`
      insert into coupons (code, kind, value, min_subtotal, max_uses, active, note)
      values (
        ${code}, ${data.kind}, ${Math.max(0, data.value)}, ${Math.max(0, data.min_subtotal)},
        ${data.max_uses ?? null}, ${data.active}, ${data.note ?? null}
      )
      on conflict (code) do update set
        kind = excluded.kind, value = excluded.value, min_subtotal = excluded.min_subtotal,
        max_uses = excluded.max_uses, active = excluded.active, note = excluded.note
    `;
    return { ok: true as const };
  });

export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    return sql<{
      id: number;
      name: string;
      email: string | null;
      phone: string | null;
      message: string;
      product_id: string | null;
      created_at: string;
    }>`select * from enquiries order by created_at desc limit 100`;
  });

export const listAbandoned = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    return sql<{ user_id: string; payload: string; updated_at: string }>`
      select user_id, payload, updated_at from cart_snapshots order by updated_at desc limit 50
    `;
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: Partial<{
      cod_enabled: boolean;
      free_shipping_over: number;
      gold_24k_tola_pkr: number;
      whatsapp_number: string;
      bank_name: string;
      bank_iban: string;
      bank_account_title: string;
      raast_id: string;
      jazzcash_merchant_id: string;
      easypaisa_store_id: string;
      card_public_key: string;
      hero_kicker: string;
      hero_title: string;
      hero_dek: string;
      gift_wrap_pkr: number;
      gst_fashion_bps: number;
    }>) => input,
  )
  .handler(async ({ context, data }) => {
    const { sql } = await requireStaff(context.userId);
    const cur = (await sql<SettingsRow>`select * from store_settings where id = 1`)[0];
    if (!cur) throw new Error("Settings missing.");
    await sql`
      update store_settings set
        cod_enabled = ${data.cod_enabled ?? cur.cod_enabled},
        free_shipping_over = ${data.free_shipping_over ?? cur.free_shipping_over},
        gold_24k_tola_pkr = ${data.gold_24k_tola_pkr ?? cur.gold_24k_tola_pkr},
        whatsapp_number = ${data.whatsapp_number ?? cur.whatsapp_number},
        bank_name = ${data.bank_name ?? cur.bank_name ?? null},
        bank_iban = ${data.bank_iban ?? cur.bank_iban ?? null},
        bank_account_title = ${data.bank_account_title ?? cur.bank_account_title ?? null},
        raast_id = ${data.raast_id ?? cur.raast_id ?? null},
        jazzcash_merchant_id = ${data.jazzcash_merchant_id ?? cur.jazzcash_merchant_id ?? null},
        easypaisa_store_id = ${data.easypaisa_store_id ?? cur.easypaisa_store_id ?? null},
        card_public_key = ${data.card_public_key ?? cur.card_public_key ?? null},
        hero_kicker = ${data.hero_kicker ?? cur.hero_kicker ?? null},
        hero_title = ${data.hero_title ?? cur.hero_title ?? null},
        hero_dek = ${data.hero_dek ?? cur.hero_dek ?? null},
        gift_wrap_pkr = ${data.gift_wrap_pkr ?? cur.gift_wrap_pkr ?? 650},
        gst_fashion_bps = ${data.gst_fashion_bps ?? cur.gst_fashion_bps ?? 0}
      where id = 1
    `;
    return (await sql<SettingsRow>`select * from store_settings where id = 1`)[0];
  });

export const setStock = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; stock: number }) => input)
  .handler(async ({ context, data }) => {
    const { sql } = await requireStaff(context.userId);
    const stock = Math.max(0, Math.round(data.stock));
    await sql`
      insert into product_stock (id, stock) values (${data.id}, ${stock})
      on conflict (id) do update set stock = ${stock}
    `;
    return { id: data.id, stock };
  });

export const listReviewsAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    return sql<{
      id: number;
      user_id: string;
      product_id: string;
      rating: number;
      title: string;
      body: string;
      created_at: string;
    }>`select id, user_id, product_id, rating, title, body, created_at from reviews order by created_at desc limit 100`;
  });

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const { sql } = await requireStaff(context.userId);
    await sql`delete from reviews where id = ${data.id}`;
    return { ok: true as const };
  });

export const listReturns = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { sql } = await requireStaff(context.userId);
    return sql<{
      id: number;
      order_id: string;
      user_id: string;
      reason: string;
      status: string;
      created_at: string;
    }>`select id, order_id, user_id, reason, status, created_at from return_requests order by created_at desc limit 100`;
  });
