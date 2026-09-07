import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Product } from "@/lib/catalog";
import { SIGNUP_COINS, REFERRAL_CREDIT_PKR, makeReferralCode, coinsForPurchase } from "@/lib/loyalty";
import { computeQuote, normalizePkPhone, type Coupon, type QuoteItemIn } from "@/lib/quote";
import { CITIES, isCity, type City, type CourierId } from "@/lib/shipping";
import { assertPayable, type PaymentMethod, type PaymentSettings } from "@/lib/payments";
import { isBangleSize, isPkRingSize } from "@/lib/sizes";
import {
  canCancel,
  canRequestReturn,
  initialStatuses,
  makeOrderId,
  makeTrackingToken,
} from "@/lib/order";
import { catalogMap, loadCatalog } from "./catalog-db";
import { FALLBACK_SETTINGS, type SettingsRow, type ProfileRow, type OrderRow } from "./types";

export type OrderInput = {
  items: QuoteItemIn[];
  payment_method: PaymentMethod;
  city: string;
  address_line: string;
  phone: string;
  courier: CourierId;
  name: string;
  notes?: string;
  coupon?: string;
  gift_wrap?: boolean;
  gift_message?: string;
  redeem_coins?: number;
  referral_code?: string;
};

async function loadSettings(sql: Awaited<ReturnType<typeof getSql>>): Promise<SettingsRow> {
  const rows = await sql<SettingsRow>`select * from store_settings where id = 1`;
  return rows[0] ?? FALLBACK_SETTINGS;
}

async function loadCoupon(sql: Awaited<ReturnType<typeof getSql>>, code?: string | null): Promise<Coupon | null> {
  if (!code) return null;
  const rows = await sql<Coupon>`select * from coupons where code = ${code.trim().toUpperCase()}`;
  return rows[0] ?? null;
}

function asCity(v: string): City {
  if (isCity(v)) return v;
  throw new Error("Please choose a Pakistani city we deliver to.");
}

function assertSizes(items: QuoteItemIn[], catalog: Record<string, Product>) {
  for (const item of items) {
    const p = catalog[item.slug];
    if (!p) continue;
    if (p.sizeType === "ring" && !isPkRingSize(item.size)) {
      throw new Error(`Choose a Pakistani ring size for ${p.name}.`);
    }
    if (p.sizeType === "bangle" && !isBangleSize(item.size)) {
      throw new Error(`Choose a bangle size for ${p.name}.`);
    }
  }
}

export async function quoteFromInput(
  sql: Awaited<ReturnType<typeof getSql>>,
  data: OrderInput,
  opts: { availableCoins: number; storeCreditPkr: number; catalog: Record<string, Product> },
) {
  const s = await loadSettings(sql);
  assertPayable(data.payment_method, s as PaymentSettings);
  const coupon = await loadCoupon(sql, data.coupon);
  assertSizes(data.items, opts.catalog);
  return computeQuote({
    items: data.items,
    catalog: opts.catalog,
    city: asCity(data.city),
    courier: data.courier,
    freeShippingOver: s.free_shipping_over,
    coupon,
    redeemCoins: data.redeem_coins ?? 0,
    availableCoins: opts.availableCoins,
    storeCreditPkr: opts.storeCreditPkr,
    giftWrap: Boolean(data.gift_wrap),
    giftWrapPkr: s.gift_wrap_pkr ?? 650,
    gstBps: s.gst_fashion_bps,
  });
}

export async function fulfillOrder(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  data: OrderInput,
  opts: { availableCoins: number; storeCreditPkr: number },
) {
  const phone = normalizePkPhone(data.phone);
  if (!phone) throw new Error("Enter a Pakistani mobile number (03XXXXXXXXX).");
  const address = data.address_line.trim();
  if (address.length < 8) throw new Error("Please write a full delivery address.");
  const name = data.name.trim().slice(0, 80);
  if (name.length < 2) throw new Error("Please add the recipient’s name.");
  if (!data.items.length) throw new Error("Your bag is empty.");
  if (!["leopard", "tcs", "call"].includes(data.courier)) throw new Error("Unknown courier.");

  const city = asCity(data.city);
  const products = await loadCatalog(sql, true);
  const catalog = catalogMap(products);
  const s = await loadSettings(sql);
  assertPayable(data.payment_method, s as PaymentSettings);

  const quote = await quoteFromInput(sql, { ...data, city, phone }, { ...opts, catalog });

  const reserved: { slug: string; qty: number }[] = [];
  let couponApplied: string | null = null;
  let coinsDebited = false;
  const isGuest = userId.startsWith("guest:");
  const coinsEarned = isGuest ? 0 : coinsForPurchase(quote.total);

  try {
    for (const line of quote.lines) {
      const reservedRow = await sql<{ stock: number }>`
        update product_stock
        set stock = stock - ${line.qty}, sold_count = sold_count + ${line.qty}
        where id = ${line.slug} and stock >= ${line.qty}
        returning stock
      `;
      if (!reservedRow[0]) {
        throw new Error(`Only a few of ${line.name} remain. Reduce the quantity.`);
      }
      reserved.push({ slug: line.slug, qty: line.qty });
    }

    if (quote.couponCode) {
      const used = await sql<{ code: string }>`
        update coupons
        set uses = uses + 1
        where code = ${quote.couponCode}
          and active = true
          and (max_uses is null or uses < max_uses)
        returning code
      `;
      if (!used[0]) throw new Error("That coupon is no longer available.");
      couponApplied = quote.couponCode;
    }

    await sql`
      insert into profiles (user_id, coins, referral_code, display_name, phone, address_line, city)
      values (${userId}, ${isGuest ? 0 : SIGNUP_COINS}, ${makeReferralCode(userId)}, ${name}, ${phone}, ${address}, ${city})
      on conflict (user_id) do nothing
    `;

    if (!isGuest) {
      const ok = await sql<{ user_id: string }>`
        update profiles
        set coins = greatest(0, coins - ${quote.coinsUsed} + ${coinsEarned}),
            store_credit_pkr = greatest(0, store_credit_pkr - ${quote.storeCredit}),
            display_name = coalesce(display_name, ${name}),
            phone = coalesce(phone, ${phone}),
            address_line = coalesce(address_line, ${address}),
            city = coalesce(city, ${city})
        where user_id = ${userId}
          and coins >= ${quote.coinsUsed}
          and store_credit_pkr >= ${quote.storeCredit}
        returning user_id
      `;
      if (!ok[0]) throw new Error("Your gold coins were just used on another order. Refresh and try again.");
      coinsDebited = true;
    }

    const id = makeOrderId();
    const token = makeTrackingToken();
    const st = initialStatuses(data.payment_method);
    const discount = quote.stackDiscount + quote.couponDiscount + quote.coinDiscount + quote.storeCredit;

    await sql`
      insert into orders (
        id, user_id, status, payment_method, subtotal, shipping, tax, discount, total,
        city, address_line, phone, courier, notes, guest_name, gift_wrap, gift_message,
        payment_status, shipment_status, tracking_token, coupon_code,
        coins_used, store_credit_used
      ) values (
        ${id}, ${userId}, ${st.status}, ${data.payment_method}, ${quote.subtotal}, ${quote.shipping},
        ${quote.tax}, ${discount}, ${quote.total}, ${city}, ${address}, ${phone}, ${data.courier},
        ${data.notes ?? null}, ${name}, ${Boolean(data.gift_wrap)}, ${data.gift_message?.slice(0, 240) ?? null},
        ${st.payment_status}, ${st.shipment_status}, ${token}, ${quote.couponCode},
        ${quote.coinsUsed}, ${quote.storeCredit}
      )
    `;
    for (const line of quote.lines) {
      await sql`
        insert into order_items (order_id, product_id, name, size, qty, unit_price)
        values (${id}, ${line.slug}, ${line.name}, ${line.size ?? null}, ${line.qty}, ${line.unit})
      `;
    }
    await sql`
      insert into order_events (order_id, status, note)
      values (${id}, ${st.status}, ${st.payment_status})
    `;

    if (data.referral_code && !isGuest) {
      const claimed = await sql<ProfileRow>`
        update profiles
        set referred_by = ${data.referral_code.trim().toUpperCase()}
        where user_id = ${userId} and referred_by is null
        returning *
      `;
      if (claimed[0]) {
        const ref = await sql<ProfileRow>`
          select * from profiles where referral_code = ${data.referral_code.trim().toUpperCase()}
        `;
        if (ref[0] && ref[0].user_id !== userId) {
          await sql`
            update profiles
            set store_credit_pkr = store_credit_pkr + ${REFERRAL_CREDIT_PKR}
            where user_id = ${ref[0].user_id}
          `;
        }
      }
    }

    await sql`delete from cart_snapshots where user_id = ${userId}`;

    return {
      id,
      total: quote.total,
      coinsEarned,
      payment_status: st.payment_status,
      tracking_token: token,
      quote,
      bank:
        data.payment_method === "bank"
          ? {
              name: s.bank_name,
              iban: s.bank_iban,
              title: s.bank_account_title,
              raast: s.raast_id,
            }
          : null,
      merchant:
        data.payment_method === "jazzcash"
          ? s.jazzcash_merchant_id
          : data.payment_method === "easypaisa"
            ? s.easypaisa_store_id
            : null,
    };
  } catch (err) {
    for (const r of reserved) {
      await sql`
        update product_stock
        set stock = stock + ${r.qty}, sold_count = greatest(0, sold_count - ${r.qty})
        where id = ${r.slug}
      `;
    }
    if (couponApplied) {
      await sql`update coupons set uses = greatest(0, uses - 1) where code = ${couponApplied}`;
    }
    if (coinsDebited && !isGuest) {
      await sql`
        update profiles
        set coins = coins + ${quote.coinsUsed} - ${coinsEarned},
            store_credit_pkr = store_credit_pkr + ${quote.storeCredit}
        where user_id = ${userId}
      `;
    }
    throw err;
  }
}

export const previewQuote = createServerFn({ method: "POST" })
  .validator((input: OrderInput) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const products = await loadCatalog(sql, true);
    return quoteFromInput(sql, data, {
      availableCoins: 0,
      storeCreditPkr: 0,
      catalog: catalogMap(products),
    });
  });

export const previewSignedQuote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: OrderInput) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const products = await loadCatalog(sql, true);
    const existing = await sql<ProfileRow>`select * from profiles where user_id = ${context.userId}`;
    return quoteFromInput(sql, data, {
      availableCoins: existing[0]?.coins ?? 0,
      storeCreditPkr: existing[0]?.store_credit_pkr ?? 0,
      catalog: catalogMap(products),
    });
  });

export const placeGuestOrder = createServerFn({ method: "POST" })
  .validator((input: OrderInput) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const phone = normalizePkPhone(data.phone);
    if (!phone) throw new Error("Enter a Pakistani mobile number (03XXXXXXXXX).");
    return fulfillOrder(sql, `guest:${phone}`, data, { availableCoins: 0, storeCreditPkr: 0 });
  });

export const placeSignedOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: OrderInput) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<ProfileRow>`select * from profiles where user_id = ${context.userId}`;
    return fulfillOrder(sql, context.userId, data, {
      availableCoins: existing[0]?.coins ?? 0,
      storeCreditPkr: existing[0]?.store_credit_pkr ?? 0,
    });
  });

export const trackOrder = createServerFn({ method: "POST" })
  .validator((input: { id: string; phone: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const phone = normalizePkPhone(data.phone);
    const id = data.id.trim().toUpperCase();
    if (!phone) throw new Error("Enter the phone number used at checkout.");
    const orders = await sql<OrderRow>`
      select * from orders
      where (id = ${id} or tracking_token = ${id})
      limit 1
    `;
    const order = orders[0];
    if (!order) throw new Error("No parcel matches that reference.");
    const last10 = phone.slice(-10);
    if (!order.phone.endsWith(last10)) {
      throw new Error("The phone number does not match this order.");
    }
    const items = await sql<{ product_id: string; name: string; size: string | null; qty: number; unit_price: number }>`
      select product_id, name, size, qty, unit_price from order_items where order_id = ${order.id}
    `;
    const events = await sql<{ status: string; note: string | null; created_at: string }>`
      select status, note, created_at from order_events where order_id = ${order.id} order by created_at
    `;
    return { order, items, events };
  });

async function restock(sql: Awaited<ReturnType<typeof getSql>>, orderId: string) {
  const orders = await sql<OrderRow>`select * from orders where id = ${orderId}`;
  const order = orders[0];
  if (!order) return;
  if (order.restocked) return;
  const items = await sql<{ product_id: string; qty: number }>`
    select product_id, qty from order_items where order_id = ${orderId}
  `;
  for (const it of items) {
    await sql`
      update product_stock
      set stock = stock + ${it.qty}, sold_count = greatest(0, sold_count - ${it.qty})
      where id = ${it.product_id}
    `;
  }
  if (order.coupon_code) {
    await sql`update coupons set uses = greatest(0, uses - 1) where code = ${order.coupon_code}`;
  }
  if (!order.user_id.startsWith("guest:")) {
    await sql`
      update profiles
      set coins = coins + ${order.coins_used ?? 0},
          store_credit_pkr = store_credit_pkr + ${order.store_credit_used ?? 0}
      where user_id = ${order.user_id}
    `;
  }
  await sql`update orders set restocked = true where id = ${orderId}`;
}

async function cancelByProof(sql: Awaited<ReturnType<typeof getSql>>, order: OrderRow, note: string) {
  if (!canCancel(order.status)) throw new Error("This parcel has already left the bench and cannot be cancelled here.");
  await restock(sql, order.id);
  await sql`
    update orders
    set status = 'cancelled', cancelled_at = now(),
        payment_status = case when payment_status = 'paid' then payment_status else 'failed' end
    where id = ${order.id}
  `;
  await sql`insert into order_events (order_id, status, note) values (${order.id}, 'cancelled', ${note})`;
  return { ok: true as const };
}

export const cancelMyOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<OrderRow>`
      select * from orders where id = ${data.id} and user_id = ${context.userId}
    `;
    const order = rows[0];
    if (!order) throw new Error("Order not found.");
    return cancelByProof(sql, order, "by collector");
  });

export const cancelGuestOrder = createServerFn({ method: "POST" })
  .validator((input: { id: string; phone: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const phone = normalizePkPhone(data.phone);
    const id = data.id.trim().toUpperCase();
    if (!phone) throw new Error("Enter the phone number used at checkout.");
    const rows = await sql<OrderRow>`
      select * from orders where (id = ${id} or tracking_token = ${id}) limit 1
    `;
    const order = rows[0];
    if (!order) throw new Error("No parcel matches that reference.");
    if (!order.phone.endsWith(phone.slice(-10))) throw new Error("The phone number does not match this order.");
    return cancelByProof(sql, order, "by guest");
  });

export const requestReturn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; reason: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<OrderRow>`
      select * from orders where id = ${data.id} and user_id = ${context.userId}
    `;
    const order = rows[0];
    if (!order) throw new Error("Order not found.");
    if (!canRequestReturn(order.status)) throw new Error("Returns open after delivery.");
    const reason = data.reason.trim().slice(0, 400);
    if (reason.length < 4) throw new Error("Please tell us why.");
    await sql`
      insert into return_requests (order_id, user_id, reason)
      values (${order.id}, ${context.userId}, ${reason})
    `;
    await sql`
      update orders set status = 'return_requested', return_reason = ${reason}
      where id = ${order.id} and user_id = ${context.userId}
    `;
    await sql`insert into order_events (order_id, status, note) values (${order.id}, 'return_requested', ${reason})`;
    return { ok: true as const };
  });

export const joinList = createServerFn({ method: "POST" })
  .validator((input: { email: string }) => input)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
    const sql = await getSql();
    await sql`
      insert into newsletter_subscribers (email) values (${email})
      on conflict (email) do nothing
    `;
    return { ok: true as const };
  });

export const sendEnquiry = createServerFn({ method: "POST" })
  .validator((input: { name: string; email?: string; phone?: string; message: string; product_id?: string }) => input)
  .handler(async ({ data }) => {
    const name = data.name.trim().slice(0, 80);
    const message = data.message.trim().slice(0, 2000);
    if (name.length < 2 || message.length < 8) throw new Error("Please write a little more.");
    const sql = await getSql();
    await sql`
      insert into enquiries (name, email, phone, message, product_id)
      values (
        ${name}, ${data.email?.trim().slice(0, 120) ?? null},
        ${data.phone?.trim().slice(0, 20) ?? null}, ${message}, ${data.product_id ?? null}
      )
    `;
    return { ok: true as const };
  });

export const trackEvent = createServerFn({ method: "POST" })
  .validator((input: { name: string; payload?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      insert into analytics_events (name, payload)
      values (${data.name.slice(0, 40)}, ${data.payload?.slice(0, 500) ?? null})
    `;
    return { ok: true as const };
  });

export const listMyAddresses = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: number;
      label: string;
      name: string | null;
      phone: string | null;
      address_line: string;
      city: string;
      is_default: boolean;
    }>`
      select id, label, name, phone, address_line, city, is_default
      from addresses where user_id = ${context.userId} order by is_default desc, id desc
    `;
  });

export const saveAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      id?: number;
      label: string;
      name?: string;
      phone?: string;
      address_line: string;
      city: string;
      is_default?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const city = asCity(data.city);
    const line = data.address_line.trim();
    if (line.length < 8) throw new Error("Please write a full address.");
    if (data.is_default) {
      await sql`update addresses set is_default = false where user_id = ${context.userId}`;
    }
    if (data.id) {
      await sql`
        update addresses set
          label = ${data.label.slice(0, 40)},
          name = ${data.name ?? null},
          phone = ${data.phone ?? null},
          address_line = ${line},
          city = ${city},
          is_default = ${Boolean(data.is_default)}
        where id = ${data.id} and user_id = ${context.userId}
      `;
    } else {
      await sql`
        insert into addresses (user_id, label, name, phone, address_line, city, is_default)
        values (
          ${context.userId}, ${data.label.slice(0, 40)}, ${data.name ?? null},
          ${data.phone ?? null}, ${line}, ${city}, ${Boolean(data.is_default)}
        )
      `;
    }
    return { ok: true as const };
  });

export const deleteAddress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from addresses where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true as const };
  });

export { CITIES, restock };
