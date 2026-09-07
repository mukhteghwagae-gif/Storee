import { r as createServerFn } from "./ssr.mjs";
import { c as PRODUCT_BY_SLUG, d as authMiddleware, m as getSql, s as PRODUCTS, u as WHATSAPP_NUMBER } from "./catalog-BkM9Pw9j.mjs";
import { t as FALLBACK_SETTINGS } from "./types-hTcay00G.mjs";
import { i as seedCatalog, n as createServerRpc, r as loadCatalog } from "./catalog-db-BWXyN09Y.mjs";
import { n as makeReferralCode } from "./loyalty-DOEbaeyS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CJPK02rg.js
var getStorefront_createServerFn_handler = createServerRpc({
	id: "26949476df6d4084ed50a1335467c20a327b12704e74a296394dc03e66e6fe98",
	name: "getStorefront",
	filename: "src/lib/server/store.ts"
}, (opts) => getStorefront.__executeServer(opts));
var getStorefront = createServerFn({ method: "GET" }).handler(getStorefront_createServerFn_handler, async () => {
	const sql = await getSql();
	await seedCatalog(sql);
	const products = await loadCatalog(sql, true);
	const stock = await sql`select id, stock, sold_count from product_stock`;
	const settingsRows = await sql`select * from store_settings where id = 1`;
	const reviews = await sql`
    select id, user_id, product_id, rating, title, body, photo_data_url, created_at
    from reviews order by created_at desc limit 80
  `;
	return {
		stock,
		settings: settingsRows[0] ?? FALLBACK_SETTINGS,
		reviews,
		products
	};
});
var getGoldRate_createServerFn_handler = createServerRpc({
	id: "f7fe77b79a96c2c41b22ffd92164dc008d597413bf468962561e612594eaa9dd",
	name: "getGoldRate",
	filename: "src/lib/server/store.ts"
}, (opts) => getGoldRate.__executeServer(opts));
var getGoldRate = createServerFn({ method: "GET" }).handler(getGoldRate_createServerFn_handler, async () => {
	const fallback = (await (await getSql())`select * from store_settings where id = 1`)[0]?.gold_24k_tola_pkr ?? 352e3;
	return {
		pkr: fallback,
		source: "stored",
		karat22: Math.round(fallback * 22 / 24)
	};
});
var getOrCreateProfile_createServerFn_handler = createServerRpc({
	id: "41ad742696eeedcc708771882429a25b52dd696f31111510fd06d66d2f00f309",
	name: "getOrCreateProfile",
	filename: "src/lib/server/store.ts"
}, (opts) => getOrCreateProfile.__executeServer(opts));
var getOrCreateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(getOrCreateProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const existing = await sql`select * from profiles where user_id = ${context.userId}`;
	if (existing[0]) return existing[0];
	const code = makeReferralCode(context.userId);
	await sql`
      insert into profiles (user_id, coins, referral_code)
      values (${context.userId}, ${100}, ${code})
      on conflict (user_id) do nothing
    `;
	return (await sql`select * from profiles where user_id = ${context.userId}`)[0];
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "d4e0225a0b471b3c0eefda06f6f0fe8748fc43cdbd0ec8f87580631bfa1bfc0c",
	name: "updateProfile",
	filename: "src/lib/server/store.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	let profile = (await sql`select * from profiles where user_id = ${context.userId}`)[0];
	if (!profile) {
		const code = makeReferralCode(context.userId);
		await sql`
        insert into profiles (user_id, coins, referral_code)
        values (${context.userId}, ${100}, ${code})
      `;
		profile = (await sql`select * from profiles where user_id = ${context.userId}`)[0];
	}
	if (data.referred_by && !profile.referred_by) {
		const ref = await sql`select * from profiles where referral_code = ${data.referred_by}`;
		if (ref[0] && ref[0].user_id !== context.userId) await sql`
          update profiles set referred_by = ${data.referred_by} where user_id = ${context.userId}
        `;
	}
	await sql`
      update profiles set
        display_name = coalesce(${data.display_name ?? null}, display_name),
        phone = coalesce(${data.phone ?? null}, phone),
        address_line = coalesce(${data.address_line ?? null}, address_line),
        city = coalesce(${data.city ?? null}, city)
      where user_id = ${context.userId}
    `;
	return (await sql`select * from profiles where user_id = ${context.userId}`)[0];
});
var listMyOrders_createServerFn_handler = createServerRpc({
	id: "5ad950e41c542dee0a0328e59f13c7eda7ed5baa488c3cb0ed020198f268ef1b",
	name: "listMyOrders",
	filename: "src/lib/server/store.ts"
}, (opts) => listMyOrders.__executeServer(opts));
var listMyOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyOrders_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	return {
		orders: await sql`
      select * from orders where user_id = ${context.userId} order by created_at desc
    `,
		items: await sql`
      select oi.order_id, oi.product_id, oi.name, oi.size, oi.qty, oi.unit_price
      from order_items oi
      join orders o on o.id = oi.order_id
      where o.user_id = ${context.userId}
    `
	};
});
var addReview_createServerFn_handler = createServerRpc({
	id: "6b704a62b6fce4d788fad4833b7815b4e409608caf6a470e8ae1618b1262c280",
	name: "addReview",
	filename: "src/lib/server/store.ts"
}, (opts) => addReview.__executeServer(opts));
var addReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addReview_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (!(await loadCatalog(sql, true)).some((p) => p.slug === data.product_id) && !PRODUCT_BY_SLUG[data.product_id]) throw new Error("Unknown piece.");
	const bought = await sql`
      select count(*)::int as n
      from order_items oi
      join orders o on o.id = oi.order_id
      where o.user_id = ${context.userId} and oi.product_id = ${data.product_id}
        and o.status in ('delivered', 'return_requested', 'returned')
    `;
	if (!bought[0] || bought[0].n < 1) throw new Error("Reviews open after a delivered order of this piece.");
	const rating = Math.min(5, Math.max(1, Math.round(data.rating)));
	const title = data.title.trim().slice(0, 80);
	const body = data.body.trim().slice(0, 1200);
	if (title.length < 2 || body.length < 8) throw new Error("Please write a little more.");
	if (data.photo_data_url && data.photo_data_url.length > 28e4) throw new Error("Please choose a smaller photograph.");
	if (((await sql`
      select count(*)::int as n from reviews
      where user_id = ${context.userId} and product_id = ${data.product_id}
    `)[0]?.n ?? 0) > 0) throw new Error("You have already reviewed this piece.");
	await sql`
      insert into reviews (user_id, product_id, rating, title, body, photo_data_url)
      values (
        ${context.userId}, ${data.product_id}, ${rating}, ${title}, ${body},
        ${data.photo_data_url ?? null}
      )
    `;
	await sql`
      insert into profiles (user_id, coins, referral_code)
      values (${context.userId}, ${125}, ${makeReferralCode(context.userId)})
      on conflict (user_id) do update set coins = profiles.coins + ${25}
    `;
	return { ok: true };
});
var toggleStockAlert_createServerFn_handler = createServerRpc({
	id: "e452d6973042f2a0288cb12e75867a0002c50a38f742a55c9a7f1b630b291b1c",
	name: "toggleStockAlert",
	filename: "src/lib/server/store.ts"
}, (opts) => toggleStockAlert.__executeServer(opts));
var toggleStockAlert = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleStockAlert_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`
      select user_id from stock_alerts
      where user_id = ${context.userId} and product_id = ${data.product_id}
    `)[0]) {
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
var saveCartSnapshot_createServerFn_handler = createServerRpc({
	id: "148cbc00a5255877d1917eb866d3e516e232c9dc6772d7322d05114b43aab399",
	name: "saveCartSnapshot",
	filename: "src/lib/server/store.ts"
}, (opts) => saveCartSnapshot.__executeServer(opts));
var saveCartSnapshot = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveCartSnapshot_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`
      insert into cart_snapshots (user_id, payload, updated_at)
      values (${context.userId}, ${data.payload.slice(0, 8e3)}, now())
      on conflict (user_id) do update set payload = excluded.payload, updated_at = now()
    `;
	return { ok: true };
});
var askConcierge_createServerFn_handler = createServerRpc({
	id: "4efdcbcea9c03324aebf44ae857b2c7ae8552cf67db005ecf1e050f44e8dbf45",
	name: "askConcierge",
	filename: "src/lib/server/store.ts"
}, (opts) => askConcierge.__executeServer(opts));
var askConcierge = createServerFn({ method: "POST" }).validator((input) => input).handler(askConcierge_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "The concierge is resting. WhatsApp us instead."
	};
	const sql = await getSql();
	const catalog = (await loadCatalog(sql, true).catch(() => PRODUCTS)).map((p) => `${p.name} (${p.slug}): ${p.karat ?? p.metal}, ${p.gemstone ?? "no gem"}, PKR ${p.price}, ${p.category}, anti-tarnish ${p.antiTarnish}, hallmarked ${p.hallmarked}. ${p.description.slice(0, 180)}`).join("\n");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 350,
			messages: [
				{
					role: "system",
					content: `You are the Sitara concierge, a luxury jewellery house in Lahore, Pakistan. Speak in calm, precise English. Short answers. Never invent stock, live gold rates, courier tracking, or prices outside this catalog. Never claim a payment went through. Cash on delivery is available when enabled. Free shipping over Rs 5,000. 7-day returns. 22k gold is hallmarked. Silver may tarnish; plated pieces are anti-tarnish. WhatsApp ${WHATSAPP_NUMBER}. Catalog:\n${catalog}`
				},
				...(data.history ?? []).slice(-6),
				{
					role: "user",
					content: data.message.slice(0, 500)
				}
			]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: "The concierge could not answer just now."
	};
	return {
		ok: true,
		text: (await res.json()).choices[0]?.message.content ?? ""
	};
});
var listMyReviews_createServerFn_handler = createServerRpc({
	id: "97af7a6f7e753cdd3c9fca1a85e83dbf256c42ca89bdcc5adf61b049585cdc98",
	name: "listMyReviews",
	filename: "src/lib/server/store.ts"
}, (opts) => listMyReviews.__executeServer(opts));
var listMyReviews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyReviews_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, user_id, product_id, rating, title, body, photo_data_url, created_at
      from reviews where user_id = ${context.userId} order by created_at desc
    `;
});
var listMyWishlist_createServerFn_handler = createServerRpc({
	id: "558dc2c9cbd4d799561df08ddcc02f663e81f64d3106b36d8c0942ca246387cc",
	name: "listMyWishlist",
	filename: "src/lib/server/store.ts"
}, (opts) => listMyWishlist.__executeServer(opts));
var listMyWishlist = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyWishlist_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select product_id from wishlists where user_id = ${context.userId} order by created_at desc
    `;
});
var saveWishlist_createServerFn_handler = createServerRpc({
	id: "fa96b75bc1ddee41e5998a50f5462d72c6f8de702304545cd7729108722736ff",
	name: "saveWishlist",
	filename: "src/lib/server/store.ts"
}, (opts) => saveWishlist.__executeServer(opts));
var saveWishlist = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveWishlist_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const slugs = Array.from(new Set(data.slugs.map((s) => s.trim()).filter(Boolean))).slice(0, 80);
	await sql`delete from wishlists where user_id = ${context.userId}`;
	for (const slug of slugs) await sql`
        insert into wishlists (user_id, product_id) values (${context.userId}, ${slug})
        on conflict do nothing
      `;
	return { ok: true };
});
//#endregion
export { addReview_createServerFn_handler, askConcierge_createServerFn_handler, getGoldRate_createServerFn_handler, getOrCreateProfile_createServerFn_handler, getStorefront_createServerFn_handler, listMyOrders_createServerFn_handler, listMyReviews_createServerFn_handler, listMyWishlist_createServerFn_handler, saveCartSnapshot_createServerFn_handler, saveWishlist_createServerFn_handler, toggleStockAlert_createServerFn_handler, updateProfile_createServerFn_handler };
