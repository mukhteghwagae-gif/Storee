import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { PRODUCTS, PRODUCT_BY_SLUG, WHATSAPP_NUMBER, type Product } from "@/lib/catalog";
import { SIGNUP_COINS, REVIEW_COINS, makeReferralCode } from "@/lib/loyalty";
import { loadCatalog, seedCatalog } from "./catalog-db";
import { FALLBACK_SETTINGS, type SettingsRow, type StockRow, type ReviewRow, type ProfileRow, type OrderRow } from "./types";

export type { SettingsRow, StockRow, ReviewRow, ProfileRow, OrderRow };

export const getStorefront = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  await seedCatalog(sql);
  const products = await loadCatalog(sql, true);
  const stock = await sql<StockRow>`select id, stock, sold_count from product_stock`;
  const settingsRows = await sql<SettingsRow>`select * from store_settings where id = 1`;
  const reviews = await sql<ReviewRow>`
    select id, user_id, product_id, rating, title, body, photo_data_url, created_at
    from reviews order by created_at desc limit 80
  `;
  const settings = settingsRows[0] ?? FALLBACK_SETTINGS;
  return { stock, settings, reviews, products };
});

export const getGoldRate = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<SettingsRow>`select * from store_settings where id = 1`;
  const fallback = rows[0]?.gold_24k_tola_pkr ?? 352000;
  // Atelier board is the sale rate. A USD ounce feed is not a PKR tola price —
  // we never invent an FX conversion and never call a converted figure "live".
  return { pkr: fallback, source: "stored" as const, karat22: Math.round((fallback * 22) / 24) };
});

export const getOrCreateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const existing = await sql<ProfileRow>`select * from profiles where user_id = ${context.userId}`;
    if (existing[0]) return existing[0];
    const code = makeReferralCode(context.userId);
    await sql`
      insert into profiles (user_id, coins, referral_code)
      values (${context.userId}, ${SIGNUP_COINS}, ${code})
      on conflict (user_id) do nothing
    `;
    const rows = await sql<ProfileRow>`select * from profiles where user_id = ${context.userId}`;
    return rows[0];
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      display_name?: string;
      phone?: string;
      address_line?: string;
      city?: string;
      referred_by?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<ProfileRow>`select * from profiles where user_id = ${context.userId}`;
    let profile = existing[0];
    if (!profile) {
      const code = makeReferralCode(context.userId);
      await sql`
        insert into profiles (user_id, coins, referral_code)
        values (${context.userId}, ${SIGNUP_COINS}, ${code})
      `;
      profile = (await sql<ProfileRow>`select * from profiles where user_id = ${context.userId}`)[0];
    }
    if (data.referred_by && !profile.referred_by) {
      const ref = await sql<ProfileRow>`select * from profiles where referral_code = ${data.referred_by}`;
      if (ref[0] && ref[0].user_id !== context.userId) {
        await sql`
          update profiles set referred_by = ${data.referred_by} where user_id = ${context.userId}
        `;
      }
    }
    await sql`
      update profiles set
        display_name = coalesce(${data.display_name ?? null}, display_name),
        phone = coalesce(${data.phone ?? null}, phone),
        address_line = coalesce(${data.address_line ?? null}, address_line),
        city = coalesce(${data.city ?? null}, city)
      where user_id = ${context.userId}
    `;
    return (await sql<ProfileRow>`select * from profiles where user_id = ${context.userId}`)[0];
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const orders = await sql<OrderRow>`
      select * from orders where user_id = ${context.userId} order by created_at desc
    `;
    const items = await sql<{
      order_id: string;
      product_id: string;
      name: string;
      size: string | null;
      qty: number;
      unit_price: number;
    }>`
      select oi.order_id, oi.product_id, oi.name, oi.size, oi.qty, oi.unit_price
      from order_items oi
      join orders o on o.id = oi.order_id
      where o.user_id = ${context.userId}
    `;
    return { orders, items };
  });

export const addReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      product_id: string;
      rating: number;
      title: string;
      body: string;
      photo_data_url?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const products = await loadCatalog(sql, true);
    if (!products.some((p) => p.slug === data.product_id) && !PRODUCT_BY_SLUG[data.product_id]) {
      throw new Error("Unknown piece.");
    }
    const bought = await sql<{ n: number }>`
      select count(*)::int as n
      from order_items oi
      join orders o on o.id = oi.order_id
      where o.user_id = ${context.userId} and oi.product_id = ${data.product_id}
        and o.status in ('delivered', 'return_requested', 'returned')
    `;
    if (!bought[0] || bought[0].n < 1) {
      throw new Error("Reviews open after a delivered order of this piece.");
    }
    const rating = Math.min(5, Math.max(1, Math.round(data.rating)));
    const title = data.title.trim().slice(0, 80);
    const body = data.body.trim().slice(0, 1200);
    if (title.length < 2 || body.length < 8) throw new Error("Please write a little more.");
    if (data.photo_data_url && data.photo_data_url.length > 280000) {
      throw new Error("Please choose a smaller photograph.");
    }
    const existing = await sql<{ n: number }>`
      select count(*)::int as n from reviews
      where user_id = ${context.userId} and product_id = ${data.product_id}
    `;
    if ((existing[0]?.n ?? 0) > 0) throw new Error("You have already reviewed this piece.");
    await sql`
      insert into reviews (user_id, product_id, rating, title, body, photo_data_url)
      values (
        ${context.userId}, ${data.product_id}, ${rating}, ${title}, ${body},
        ${data.photo_data_url ?? null}
      )
    `;
    await sql`
      insert into profiles (user_id, coins, referral_code)
      values (${context.userId}, ${SIGNUP_COINS + REVIEW_COINS}, ${makeReferralCode(context.userId)})
      on conflict (user_id) do update set coins = profiles.coins + ${REVIEW_COINS}
    `;
    return { ok: true as const };
  });

export const toggleStockAlert = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { product_id: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<{ user_id: string }>`
      select user_id from stock_alerts
      where user_id = ${context.userId} and product_id = ${data.product_id}
    `;
    if (existing[0]) {
      await sql`
        delete from stock_alerts
        where user_id = ${context.userId} and product_id = ${data.product_id}
      `;
      return { watching: false };
    }
    await sql`
      insert into stock_alerts (user_id, product_id)
      values (${context.userId}, ${data.product_id})
    `;
    return { watching: true };
  });

export const saveCartSnapshot = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { payload: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into cart_snapshots (user_id, payload, updated_at)
      values (${context.userId}, ${data.payload.slice(0, 8000)}, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
    return { ok: true as const };
  });

export const askConcierge = createServerFn({ method: "POST" })
  .validator((input: { message: string; history?: { role: "user" | "assistant"; content: string }[] }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        error: "The concierge is resting. WhatsApp us instead.",
      };
    }
    const sql = await getSql();
    const live = await loadCatalog(sql, true).catch(() => PRODUCTS as Product[]);
    const catalog = live
      .map(
        (p) =>
          `${p.name} (${p.slug}): ${p.karat ?? p.metal}, ${p.gemstone ?? "no gem"}, PKR ${p.price}, ${p.category}, anti-tarnish ${p.antiTarnish}, hallmarked ${p.hallmarked}. ${p.description.slice(0, 180)}`,
      )
      .join("\n");
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: `You are the Sitara concierge, a luxury jewellery house in Lahore, Pakistan. Speak in calm, precise English. Short answers. Never invent stock, live gold rates, courier tracking, or prices outside this catalog. Never claim a payment went through. Cash on delivery is available when enabled. Free shipping over Rs 5,000. 7-day returns. 22k gold is hallmarked. Silver may tarnish; plated pieces are anti-tarnish. WhatsApp ${WHATSAPP_NUMBER}. Catalog:\n${catalog}`,
          },
          ...(data.history ?? []).slice(-6),
          { role: "user", content: data.message.slice(0, 500) },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: "The concierge could not answer just now." };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });

export const listMyReviews = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<ReviewRow>`
      select id, user_id, product_id, rating, title, body, photo_data_url, created_at
      from reviews where user_id = ${context.userId} order by created_at desc
    `;
  });

export const listMyWishlist = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{ product_id: string }>`
      select product_id from wishlists where user_id = ${context.userId} order by created_at desc
    `;
  });

export const saveWishlist = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slugs: string[] }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const slugs = Array.from(new Set(data.slugs.map((s) => s.trim()).filter(Boolean))).slice(0, 80);
    await sql`delete from wishlists where user_id = ${context.userId}`;
    for (const slug of slugs) {
      await sql`
        insert into wishlists (user_id, product_id) values (${context.userId}, ${slug})
        on conflict do nothing
      `;
    }
    return { ok: true as const };
  });
