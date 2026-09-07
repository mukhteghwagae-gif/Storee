import { c as shipmentForOrderStatus, t as NEXT_STATUS } from "./order-BuQcDLgy.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { d as authMiddleware, m as getSql } from "./catalog-BkM9Pw9j.mjs";
import { f as restock } from "./commerce-BpEajYIO.mjs";
import { n as createServerRpc, r as loadCatalog } from "./catalog-db-BWXyN09Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CFMiag0t.js
async function requireStaff(userId) {
	const sql = await getSql();
	const rows = await sql`select user_id, role from staff where user_id = ${userId}`;
	if (!rows[0]) throw new Error("Forbidden");
	return {
		sql,
		role: rows[0].role
	};
}
var staffStatus_createServerFn_handler = createServerRpc({
	id: "3bd433209f0a6c0e125b0ce1188e64dc355b6b73d6702e6b6ca4fac0f85871a8",
	name: "staffStatus",
	filename: "src/lib/server/admin.ts"
}, (opts) => staffStatus.__executeServer(opts));
var staffStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(staffStatus_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const mine = await sql`
      select user_id, role from staff where user_id = ${context.userId}
    `;
	const countRows = await sql`select count(*)::int as n from staff`;
	return {
		isStaff: Boolean(mine[0]),
		role: mine[0]?.role ?? null,
		open: (countRows[0]?.n ?? 0) === 0
	};
});
var claimAtelier_createServerFn_handler = createServerRpc({
	id: "6619c03802a6c9e977f40f112266380dba443e908c5ca60fb346c4171b62c748",
	name: "claimAtelier",
	filename: "src/lib/server/admin.ts"
}, (opts) => claimAtelier.__executeServer(opts));
var claimAtelier = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimAtelier_createServerFn_handler, async ({ context }) => {
	if (!(await (await getSql())`
      insert into staff (user_id, role)
      select ${context.userId}, 'owner'
      where not exists (select 1 from staff)
      returning user_id, role
    `)[0]) throw new Error("This atelier already has a keeper.");
	return {
		ok: true,
		role: "owner"
	};
});
var addStaff_createServerFn_handler = createServerRpc({
	id: "8d9edc443551f98e947b4cabf0d4e2178e83dafe1fece7513c8f6a786ccbf02a",
	name: "addStaff",
	filename: "src/lib/server/admin.ts"
}, (opts) => addStaff.__executeServer(opts));
var addStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addStaff_createServerFn_handler, async ({ context, data }) => {
	const { sql, role } = await requireStaff(context.userId);
	if (role !== "owner") throw new Error("Only the keeper can add staff.");
	const uid = data.user_id.trim();
	if (uid.length < 3) throw new Error("Need a user id.");
	await sql`
      insert into staff (user_id, role) values (${uid}, 'admin')
      on conflict (user_id) do nothing
    `;
	return { ok: true };
});
var listStaff_createServerFn_handler = createServerRpc({
	id: "9bf07e8d117bfda86feafad3b833a921e032fdddca5aee616a509ce998957317",
	name: "listStaff",
	filename: "src/lib/server/admin.ts"
}, (opts) => listStaff.__executeServer(opts));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStaff_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	return sql`
      select user_id, role, created_at from staff order by created_at
    `;
});
var listAllOrders_createServerFn_handler = createServerRpc({
	id: "5967351cde5a35c11906b117563bb13d44cdb9ede8345b5910c65c9bf3ab6ba5",
	name: "listAllOrders",
	filename: "src/lib/server/admin.ts"
}, (opts) => listAllOrders.__executeServer(opts));
var listAllOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAllOrders_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	return {
		orders: await sql`select * from orders order by created_at desc limit 200`,
		items: await sql`select order_id, product_id, name, size, qty, unit_price from order_items`
	};
});
var setOrderStatus_createServerFn_handler = createServerRpc({
	id: "5270b1ef1a6ea190f1be2ce7b1d6b2c59003a8e61c7e32d52845e832529e5a58",
	name: "setOrderStatus",
	filename: "src/lib/server/admin.ts"
}, (opts) => setOrderStatus.__executeServer(opts));
var setOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setOrderStatus_createServerFn_handler, async ({ context, data }) => {
	const { sql } = await requireStaff(context.userId);
	const order = (await sql`select * from orders where id = ${data.id}`)[0];
	if (!order) throw new Error("Order not found.");
	if (!(NEXT_STATUS[order.status] ?? []).includes(data.status)) throw new Error(`Cannot move ${order.status} to ${data.status}.`);
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
	return { ok: true };
});
var confirmPayment_createServerFn_handler = createServerRpc({
	id: "9dbe3ec74afb065e4674cf9d36bff7cc0c6b0e6d20144d09b7c4d6798ba5ae5e",
	name: "confirmPayment",
	filename: "src/lib/server/admin.ts"
}, (opts) => confirmPayment.__executeServer(opts));
var confirmPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(confirmPayment_createServerFn_handler, async ({ context, data }) => {
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
	return { ok: true };
});
var dashboard_createServerFn_handler = createServerRpc({
	id: "5feaca4936912143d52b3a45870244df1c11241858cfde1f3b9acf432b7e1cd5",
	name: "dashboard",
	filename: "src/lib/server/admin.ts"
}, (opts) => dashboard.__executeServer(opts));
var dashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(dashboard_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	const orders = await sql`
      select count(*)::int as n, coalesce(sum(total), 0)::int as revenue from orders where status <> 'cancelled'
    `;
	const pending = await sql`select count(*)::int as n from orders where status = 'pending'`;
	const low = await sql`
      select id, stock from product_stock where stock <= 3 order by stock
    `;
	const events = await sql`
      select name, count(*)::int as n from analytics_events group by name order by n desc
    `;
	const abandoned = await sql`select count(*)::int as n from cart_snapshots`;
	const subscribers = await sql`select count(*)::int as n from newsletter_subscribers`;
	return {
		orders: orders[0]?.n ?? 0,
		revenue: orders[0]?.revenue ?? 0,
		pending: pending[0]?.n ?? 0,
		lowStock: low,
		events,
		abandoned: abandoned[0]?.n ?? 0,
		subscribers: subscribers[0]?.n ?? 0
	};
});
var listCatalogAdmin_createServerFn_handler = createServerRpc({
	id: "78b0bd1c885775a543602216ac7dea30569c91ee99d32771bb4f1d31ddc1c2ea",
	name: "listCatalogAdmin",
	filename: "src/lib/server/admin.ts"
}, (opts) => listCatalogAdmin.__executeServer(opts));
var listCatalogAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCatalogAdmin_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	const products = await loadCatalog(sql, false);
	const published = await sql`select slug, published from catalog_products`;
	const stock = await sql`
      select id, stock, sold_count from product_stock
    `;
	return {
		products,
		published: Object.fromEntries(published.map((p) => [p.slug, p.published])),
		stock
	};
});
var saveProduct_createServerFn_handler = createServerRpc({
	id: "c4aae746ec01594c928a931887e3cef55f36ca20041da203c188438e768141ea",
	name: "saveProduct",
	filename: "src/lib/server/admin.ts"
}, (opts) => saveProduct.__executeServer(opts));
var saveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveProduct_createServerFn_handler, async ({ context, data }) => {
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
	return {
		ok: true,
		slug
	};
});
var listCustomers_createServerFn_handler = createServerRpc({
	id: "1baded16fbb9c94f3b63b4b1ac24fe22a18ff4da83a4d49f75c28f03f48384a6",
	name: "listCustomers",
	filename: "src/lib/server/admin.ts"
}, (opts) => listCustomers.__executeServer(opts));
var listCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCustomers_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	return sql`select * from profiles order by created_at desc limit 200`;
});
var listCoupons_createServerFn_handler = createServerRpc({
	id: "934b62f0d81d5a4cb09a3c17ec638c2fb55d77232a220414a7f964abfb13324c",
	name: "listCoupons",
	filename: "src/lib/server/admin.ts"
}, (opts) => listCoupons.__executeServer(opts));
var listCoupons = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCoupons_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	return sql`select * from coupons order by code`;
});
var saveCoupon_createServerFn_handler = createServerRpc({
	id: "414389423e2928dbb578906e4567ad7b203f1a4d65e02ebaa070365826f3fe63",
	name: "saveCoupon",
	filename: "src/lib/server/admin.ts"
}, (opts) => saveCoupon.__executeServer(opts));
var saveCoupon = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveCoupon_createServerFn_handler, async ({ context, data }) => {
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
	return { ok: true };
});
var listEnquiries_createServerFn_handler = createServerRpc({
	id: "94603f7e3a4f63b3d4915a78c36ef3cbb6b2a26be5d3b3af241b6773761f7f94",
	name: "listEnquiries",
	filename: "src/lib/server/admin.ts"
}, (opts) => listEnquiries.__executeServer(opts));
var listEnquiries = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEnquiries_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	return sql`select * from enquiries order by created_at desc limit 100`;
});
var listAbandoned_createServerFn_handler = createServerRpc({
	id: "baa1b71d7adf02fec382b9be70eb5ce14329c04ca4fadb3080e045bda5d6cb1b",
	name: "listAbandoned",
	filename: "src/lib/server/admin.ts"
}, (opts) => listAbandoned.__executeServer(opts));
var listAbandoned = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAbandoned_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	return sql`
      select user_id, payload, updated_at from cart_snapshots order by updated_at desc limit 50
    `;
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "c2e088d673ccff2c8e6325f78aa413af66c01db491d13cf76f532e67bb73b352",
	name: "saveSettings",
	filename: "src/lib/server/admin.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveSettings_createServerFn_handler, async ({ context, data }) => {
	const { sql } = await requireStaff(context.userId);
	const cur = (await sql`select * from store_settings where id = 1`)[0];
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
	return (await sql`select * from store_settings where id = 1`)[0];
});
var setStock_createServerFn_handler = createServerRpc({
	id: "5673260c1b24e534aa4facd9f5d95e912c0e8fc0024ea19f5662ae005c5bd7ce",
	name: "setStock",
	filename: "src/lib/server/admin.ts"
}, (opts) => setStock.__executeServer(opts));
var setStock = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setStock_createServerFn_handler, async ({ context, data }) => {
	const { sql } = await requireStaff(context.userId);
	const stock = Math.max(0, Math.round(data.stock));
	await sql`
      insert into product_stock (id, stock) values (${data.id}, ${stock})
      on conflict (id) do update set stock = ${stock}
    `;
	return {
		id: data.id,
		stock
	};
});
var listReviewsAdmin_createServerFn_handler = createServerRpc({
	id: "17b75806be9f53d423c8a02ca1e4f3330a37559fd15b7fade0c6bc4f8d736078",
	name: "listReviewsAdmin",
	filename: "src/lib/server/admin.ts"
}, (opts) => listReviewsAdmin.__executeServer(opts));
var listReviewsAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listReviewsAdmin_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	return sql`select id, user_id, product_id, rating, title, body, created_at from reviews order by created_at desc limit 100`;
});
var deleteReview_createServerFn_handler = createServerRpc({
	id: "e0ee6ac95453c8a25c68385b7553352e3ffdfa2ada0808cf9fffab4ef0555b18",
	name: "deleteReview",
	filename: "src/lib/server/admin.ts"
}, (opts) => deleteReview.__executeServer(opts));
var deleteReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(deleteReview_createServerFn_handler, async ({ context, data }) => {
	const { sql } = await requireStaff(context.userId);
	await sql`delete from reviews where id = ${data.id}`;
	return { ok: true };
});
var listReturns_createServerFn_handler = createServerRpc({
	id: "9d83cf47d650f6079afd6505dcafe917ce9b046021243aa5ac3601ebd2fe6615",
	name: "listReturns",
	filename: "src/lib/server/admin.ts"
}, (opts) => listReturns.__executeServer(opts));
var listReturns = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listReturns_createServerFn_handler, async ({ context }) => {
	const { sql } = await requireStaff(context.userId);
	return sql`select id, order_id, user_id, reason, status, created_at from return_requests order by created_at desc limit 100`;
});
//#endregion
export { addStaff_createServerFn_handler, claimAtelier_createServerFn_handler, confirmPayment_createServerFn_handler, dashboard_createServerFn_handler, deleteReview_createServerFn_handler, listAbandoned_createServerFn_handler, listAllOrders_createServerFn_handler, listCatalogAdmin_createServerFn_handler, listCoupons_createServerFn_handler, listCustomers_createServerFn_handler, listEnquiries_createServerFn_handler, listReturns_createServerFn_handler, listReviewsAdmin_createServerFn_handler, listStaff_createServerFn_handler, saveCoupon_createServerFn_handler, saveProduct_createServerFn_handler, saveSettings_createServerFn_handler, setOrderStatus_createServerFn_handler, setStock_createServerFn_handler, staffStatus_createServerFn_handler };
