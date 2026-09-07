import { a as initialStatuses, i as canRequestReturn, o as makeOrderId, r as canCancel, s as makeTrackingToken } from "./order-BuQcDLgy.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { c as PRODUCT_BY_SLUG, d as authMiddleware, m as getSql } from "./catalog-BkM9Pw9j.mjs";
import { n as estimateShipping, r as isCity } from "./shipping-DOUYcwLY.mjs";
import { t as FALLBACK_SETTINGS } from "./types-hTcay00G.mjs";
import { n as createServerRpc, r as loadCatalog, t as catalogMap } from "./catalog-db-BWXyN09Y.mjs";
import { a as isBangleSize, o as isPkRingSize } from "./sizes-36DjQiLN.mjs";
import { t as assertPayable } from "./payments-B7YEvpME.mjs";
import { n as makeReferralCode, t as coinsForPurchase } from "./loyalty-DOEbaeyS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-DBjSWpi0.js
var STACK_BUNDLE_RATE = .1;
function computeQuote(opts) {
	const catalog = opts.catalog ?? PRODUCT_BY_SLUG;
	const lines = [];
	for (const item of opts.items) {
		const qty = Math.floor(item.qty);
		if (!Number.isFinite(qty) || qty < 1) throw new Error("Invalid quantity.");
		const p = catalog[item.slug];
		if (!p) throw new Error("A piece in your bag is no longer offered.");
		lines.push({
			slug: p.slug,
			name: p.name,
			qty,
			size: item.size,
			unit: p.price,
			lineTotal: p.price * qty,
			stackable: Boolean(p.stackable)
		});
	}
	if (lines.length === 0) throw new Error("Your bag is empty.");
	const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
	const stackQty = lines.filter((l) => l.stackable).reduce((s, l) => s + l.qty, 0);
	const stackSub = lines.filter((l) => l.stackable).reduce((s, l) => s + l.lineTotal, 0);
	const stackDiscount = stackQty >= 3 ? Math.round(stackSub * STACK_BUNDLE_RATE) : 0;
	const afterStack = Math.max(0, subtotal - stackDiscount);
	let couponDiscount = 0;
	let couponCode = null;
	let shippingIsFree = false;
	const coupon = opts.coupon;
	if (coupon && coupon.active && afterStack >= coupon.min_subtotal) {
		if (coupon.max_uses == null || coupon.uses < coupon.max_uses) {
			couponCode = coupon.code;
			if (coupon.kind === "percent") couponDiscount = Math.round(afterStack * Math.min(coupon.value, 100) / 100);
			else if (coupon.kind === "fixed") couponDiscount = Math.min(afterStack, Math.max(0, coupon.value));
			else if (coupon.kind === "shipping") shippingIsFree = true;
		}
	}
	const afterCoupon = Math.max(0, afterStack - couponDiscount);
	const ship = estimateShipping({
		city: opts.city,
		subtotal: shippingIsFree ? opts.freeShippingOver : afterCoupon,
		freeOver: opts.freeShippingOver,
		courier: opts.courier
	});
	const shipping = shippingIsFree ? 0 : ship.pkr;
	const giftWrap = opts.giftWrap ? Math.max(0, opts.giftWrapPkr ?? 650) : 0;
	const tax = Math.round(afterCoupon * Math.max(0, opts.gstBps ?? 0) / 1e4);
	const availableCoins = Math.max(0, Math.floor(opts.availableCoins ?? 0));
	const requestedCoins = Math.max(0, Math.floor(opts.redeemCoins ?? 0));
	const coinsUsed = Math.min(availableCoins, requestedCoins, afterCoupon);
	const coinDiscount = coinsUsed;
	const storeCredit = Math.min(Math.max(0, Math.floor(opts.storeCreditPkr ?? 0)), afterCoupon - coinDiscount);
	const total = Math.max(0, afterCoupon + shipping + giftWrap + tax - coinDiscount - storeCredit);
	return {
		lines,
		subtotal,
		stackDiscount,
		couponCode,
		couponDiscount,
		shipping,
		shippingLabel: shipping === 0 ? "Complimentary" : ship.label,
		days: ship.days,
		courier: ship.courier,
		giftWrap,
		coinDiscount,
		coinsUsed,
		storeCredit,
		tax,
		total
	};
}
function normalizePkPhone(raw) {
	const d = raw.replace(/\D/g, "");
	if (/^03\d{9}$/.test(d)) return "92" + d.slice(1);
	if (/^923\d{9}$/.test(d)) return d;
	return null;
}
async function loadSettings(sql) {
	return (await sql`select * from store_settings where id = 1`)[0] ?? FALLBACK_SETTINGS;
}
async function loadCoupon(sql, code) {
	if (!code) return null;
	return (await sql`select * from coupons where code = ${code.trim().toUpperCase()}`)[0] ?? null;
}
function asCity(v) {
	if (isCity(v)) return v;
	throw new Error("Please choose a Pakistani city we deliver to.");
}
function assertSizes(items, catalog) {
	for (const item of items) {
		const p = catalog[item.slug];
		if (!p) continue;
		if (p.sizeType === "ring" && !isPkRingSize(item.size)) throw new Error(`Choose a Pakistani ring size for ${p.name}.`);
		if (p.sizeType === "bangle" && !isBangleSize(item.size)) throw new Error(`Choose a bangle size for ${p.name}.`);
	}
}
async function quoteFromInput(sql, data, opts) {
	const s = await loadSettings(sql);
	assertPayable(data.payment_method, s);
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
		gstBps: s.gst_fashion_bps
	});
}
async function fulfillOrder(sql, userId, data, opts) {
	const phone = normalizePkPhone(data.phone);
	if (!phone) throw new Error("Enter a Pakistani mobile number (03XXXXXXXXX).");
	const address = data.address_line.trim();
	if (address.length < 8) throw new Error("Please write a full delivery address.");
	const name = data.name.trim().slice(0, 80);
	if (name.length < 2) throw new Error("Please add the recipient’s name.");
	if (!data.items.length) throw new Error("Your bag is empty.");
	if (![
		"leopard",
		"tcs",
		"call"
	].includes(data.courier)) throw new Error("Unknown courier.");
	const city = asCity(data.city);
	const products = await loadCatalog(sql, true);
	const catalog = catalogMap(products);
	const s = await loadSettings(sql);
	assertPayable(data.payment_method, s);
	const quote = await quoteFromInput(sql, {
		...data,
		city,
		phone
	}, {
		...opts,
		catalog
	});
	const reserved = [];
	let couponApplied = null;
	let coinsDebited = false;
	const isGuest = userId.startsWith("guest:");
	const coinsEarned = isGuest ? 0 : coinsForPurchase(quote.total);
	try {
		for (const line of quote.lines) {
			if (!(await sql`
        update product_stock
        set stock = stock - ${line.qty}, sold_count = sold_count + ${line.qty}
        where id = ${line.slug} and stock >= ${line.qty}
        returning stock
      `)[0]) throw new Error(`Only a few of ${line.name} remain. Reduce the quantity.`);
			reserved.push({
				slug: line.slug,
				qty: line.qty
			});
		}
		if (quote.couponCode) {
			if (!(await sql`
        update coupons
        set uses = uses + 1
        where code = ${quote.couponCode}
          and active = true
          and (max_uses is null or uses < max_uses)
        returning code
      `)[0]) throw new Error("That coupon is no longer available.");
			couponApplied = quote.couponCode;
		}
		await sql`
      insert into profiles (user_id, coins, referral_code, display_name, phone, address_line, city)
      values (${userId}, ${isGuest ? 0 : 100}, ${makeReferralCode(userId)}, ${name}, ${phone}, ${address}, ${city})
      on conflict (user_id) do nothing
    `;
		if (!isGuest) {
			if (!(await sql`
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
      `)[0]) throw new Error("Your gold coins were just used on another order. Refresh and try again.");
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
		for (const line of quote.lines) await sql`
        insert into order_items (order_id, product_id, name, size, qty, unit_price)
        values (${id}, ${line.slug}, ${line.name}, ${line.size ?? null}, ${line.qty}, ${line.unit})
      `;
		await sql`
      insert into order_events (order_id, status, note)
      values (${id}, ${st.status}, ${st.payment_status})
    `;
		if (data.referral_code && !isGuest) {
			if ((await sql`
        update profiles
        set referred_by = ${data.referral_code.trim().toUpperCase()}
        where user_id = ${userId} and referred_by is null
        returning *
      `)[0]) {
				const ref = await sql`
          select * from profiles where referral_code = ${data.referral_code.trim().toUpperCase()}
        `;
				if (ref[0] && ref[0].user_id !== userId) await sql`
            update profiles
            set store_credit_pkr = store_credit_pkr + ${500}
            where user_id = ${ref[0].user_id}
          `;
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
			bank: data.payment_method === "bank" ? {
				name: s.bank_name,
				iban: s.bank_iban,
				title: s.bank_account_title,
				raast: s.raast_id
			} : null,
			merchant: data.payment_method === "jazzcash" ? s.jazzcash_merchant_id : data.payment_method === "easypaisa" ? s.easypaisa_store_id : null
		};
	} catch (err) {
		for (const r of reserved) await sql`
        update product_stock
        set stock = stock + ${r.qty}, sold_count = greatest(0, sold_count - ${r.qty})
        where id = ${r.slug}
      `;
		if (couponApplied) await sql`update coupons set uses = greatest(0, uses - 1) where code = ${couponApplied}`;
		if (coinsDebited && !isGuest) await sql`
        update profiles
        set coins = coins + ${quote.coinsUsed} - ${coinsEarned},
            store_credit_pkr = store_credit_pkr + ${quote.storeCredit}
        where user_id = ${userId}
      `;
		throw err;
	}
}
var previewQuote_createServerFn_handler = createServerRpc({
	id: "10e38fdf221bcc8bac18c3c1b8e23244bb6dc284a3df824b4cc716bfd6dedc73",
	name: "previewQuote",
	filename: "src/lib/server/commerce.ts"
}, (opts) => previewQuote.__executeServer(opts));
var previewQuote = createServerFn({ method: "POST" }).validator((input) => input).handler(previewQuote_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const products = await loadCatalog(sql, true);
	return quoteFromInput(sql, data, {
		availableCoins: 0,
		storeCreditPkr: 0,
		catalog: catalogMap(products)
	});
});
var previewSignedQuote_createServerFn_handler = createServerRpc({
	id: "23b606d10058aaf6122fc56774c415671abef9bfde39443bcd992c9a17af80ee",
	name: "previewSignedQuote",
	filename: "src/lib/server/commerce.ts"
}, (opts) => previewSignedQuote.__executeServer(opts));
var previewSignedQuote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(previewSignedQuote_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const products = await loadCatalog(sql, true);
	const existing = await sql`select * from profiles where user_id = ${context.userId}`;
	return quoteFromInput(sql, data, {
		availableCoins: existing[0]?.coins ?? 0,
		storeCreditPkr: existing[0]?.store_credit_pkr ?? 0,
		catalog: catalogMap(products)
	});
});
var placeGuestOrder_createServerFn_handler = createServerRpc({
	id: "c0855ed94dc00d17fbf129a2e4f168f679f21d6e5c3b00e1ea3deba136289ef2",
	name: "placeGuestOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => placeGuestOrder.__executeServer(opts));
var placeGuestOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(placeGuestOrder_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const phone = normalizePkPhone(data.phone);
	if (!phone) throw new Error("Enter a Pakistani mobile number (03XXXXXXXXX).");
	return fulfillOrder(sql, `guest:${phone}`, data, {
		availableCoins: 0,
		storeCreditPkr: 0
	});
});
var placeSignedOrder_createServerFn_handler = createServerRpc({
	id: "f025e22565a163e5462519618a3aefbaec1df9f177ff6f2d05b84fcbf334ae1e",
	name: "placeSignedOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => placeSignedOrder.__executeServer(opts));
var placeSignedOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(placeSignedOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const existing = await sql`select * from profiles where user_id = ${context.userId}`;
	return fulfillOrder(sql, context.userId, data, {
		availableCoins: existing[0]?.coins ?? 0,
		storeCreditPkr: existing[0]?.store_credit_pkr ?? 0
	});
});
var trackOrder_createServerFn_handler = createServerRpc({
	id: "f37d3f17b3dc0705b699128f26d2418832b8ee937e502eeb891aedc2c864c90d",
	name: "trackOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => trackOrder.__executeServer(opts));
var trackOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(trackOrder_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const phone = normalizePkPhone(data.phone);
	const id = data.id.trim().toUpperCase();
	if (!phone) throw new Error("Enter the phone number used at checkout.");
	const order = (await sql`
      select * from orders
      where (id = ${id} or tracking_token = ${id})
      limit 1
    `)[0];
	if (!order) throw new Error("No parcel matches that reference.");
	const last10 = phone.slice(-10);
	if (!order.phone.endsWith(last10)) throw new Error("The phone number does not match this order.");
	return {
		order,
		items: await sql`
      select product_id, name, size, qty, unit_price from order_items where order_id = ${order.id}
    `,
		events: await sql`
      select status, note, created_at from order_events where order_id = ${order.id} order by created_at
    `
	};
});
async function restock(sql, orderId) {
	const order = (await sql`select * from orders where id = ${orderId}`)[0];
	if (!order) return;
	if (order.restocked) return;
	const items = await sql`
    select product_id, qty from order_items where order_id = ${orderId}
  `;
	for (const it of items) await sql`
      update product_stock
      set stock = stock + ${it.qty}, sold_count = greatest(0, sold_count - ${it.qty})
      where id = ${it.product_id}
    `;
	if (order.coupon_code) await sql`update coupons set uses = greatest(0, uses - 1) where code = ${order.coupon_code}`;
	if (!order.user_id.startsWith("guest:")) await sql`
      update profiles
      set coins = coins + ${order.coins_used ?? 0},
          store_credit_pkr = store_credit_pkr + ${order.store_credit_used ?? 0}
      where user_id = ${order.user_id}
    `;
	await sql`update orders set restocked = true where id = ${orderId}`;
}
async function cancelByProof(sql, order, note) {
	if (!canCancel(order.status)) throw new Error("This parcel has already left the bench and cannot be cancelled here.");
	await restock(sql, order.id);
	await sql`
    update orders
    set status = 'cancelled', cancelled_at = now(),
        payment_status = case when payment_status = 'paid' then payment_status else 'failed' end
    where id = ${order.id}
  `;
	await sql`insert into order_events (order_id, status, note) values (${order.id}, 'cancelled', ${note})`;
	return { ok: true };
}
var cancelMyOrder_createServerFn_handler = createServerRpc({
	id: "2f83125957602c5c313ae3dbe05862640a95f58868ac8602384ca8b8dd7d3005",
	name: "cancelMyOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => cancelMyOrder.__executeServer(opts));
var cancelMyOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(cancelMyOrder_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const order = (await sql`
      select * from orders where id = ${data.id} and user_id = ${context.userId}
    `)[0];
	if (!order) throw new Error("Order not found.");
	return cancelByProof(sql, order, "by collector");
});
var cancelGuestOrder_createServerFn_handler = createServerRpc({
	id: "db0827fe2a85d64e9958ff858e5a8fe0357bcc1d6428f1e0acfb778fe89b7633",
	name: "cancelGuestOrder",
	filename: "src/lib/server/commerce.ts"
}, (opts) => cancelGuestOrder.__executeServer(opts));
var cancelGuestOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(cancelGuestOrder_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const phone = normalizePkPhone(data.phone);
	const id = data.id.trim().toUpperCase();
	if (!phone) throw new Error("Enter the phone number used at checkout.");
	const order = (await sql`
      select * from orders where (id = ${id} or tracking_token = ${id}) limit 1
    `)[0];
	if (!order) throw new Error("No parcel matches that reference.");
	if (!order.phone.endsWith(phone.slice(-10))) throw new Error("The phone number does not match this order.");
	return cancelByProof(sql, order, "by guest");
});
var requestReturn_createServerFn_handler = createServerRpc({
	id: "bc37617d9633340add2356a546ee38dc0d9827238af5009888ae01e6f9cc27fd",
	name: "requestReturn",
	filename: "src/lib/server/commerce.ts"
}, (opts) => requestReturn.__executeServer(opts));
var requestReturn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(requestReturn_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const order = (await sql`
      select * from orders where id = ${data.id} and user_id = ${context.userId}
    `)[0];
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
	return { ok: true };
});
var joinList_createServerFn_handler = createServerRpc({
	id: "5d3497d89a257a82be2f4c2ae350101b379a876b43f509ebddc73e56e107aba0",
	name: "joinList",
	filename: "src/lib/server/commerce.ts"
}, (opts) => joinList.__executeServer(opts));
var joinList = createServerFn({ method: "POST" }).validator((input) => input).handler(joinList_createServerFn_handler, async ({ data }) => {
	const email = data.email.trim().toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
	await (await getSql())`
      insert into newsletter_subscribers (email) values (${email})
      on conflict (email) do nothing
    `;
	return { ok: true };
});
var sendEnquiry_createServerFn_handler = createServerRpc({
	id: "5eb6d1e38cc352da17b800b5c57aece58ad10f2fc35aeb873c632c33e4a9573f",
	name: "sendEnquiry",
	filename: "src/lib/server/commerce.ts"
}, (opts) => sendEnquiry.__executeServer(opts));
var sendEnquiry = createServerFn({ method: "POST" }).validator((input) => input).handler(sendEnquiry_createServerFn_handler, async ({ data }) => {
	const name = data.name.trim().slice(0, 80);
	const message = data.message.trim().slice(0, 2e3);
	if (name.length < 2 || message.length < 8) throw new Error("Please write a little more.");
	await (await getSql())`
      insert into enquiries (name, email, phone, message, product_id)
      values (
        ${name}, ${data.email?.trim().slice(0, 120) ?? null},
        ${data.phone?.trim().slice(0, 20) ?? null}, ${message}, ${data.product_id ?? null}
      )
    `;
	return { ok: true };
});
var trackEvent_createServerFn_handler = createServerRpc({
	id: "1d440c15eab6dc0769e3ae53d8d6e4659e14e769100065fd75c0aa55c93b56c8",
	name: "trackEvent",
	filename: "src/lib/server/commerce.ts"
}, (opts) => trackEvent.__executeServer(opts));
var trackEvent = createServerFn({ method: "POST" }).validator((input) => input).handler(trackEvent_createServerFn_handler, async ({ data }) => {
	await (await getSql())`
      insert into analytics_events (name, payload)
      values (${data.name.slice(0, 40)}, ${data.payload?.slice(0, 500) ?? null})
    `;
	return { ok: true };
});
var listMyAddresses_createServerFn_handler = createServerRpc({
	id: "36dcab8cc1a06d7e71106dff705d1fcf1e3bada5136e6e7193d2b217aaeef43f",
	name: "listMyAddresses",
	filename: "src/lib/server/commerce.ts"
}, (opts) => listMyAddresses.__executeServer(opts));
var listMyAddresses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyAddresses_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, label, name, phone, address_line, city, is_default
      from addresses where user_id = ${context.userId} order by is_default desc, id desc
    `;
});
var saveAddress_createServerFn_handler = createServerRpc({
	id: "118760e18905b9f60eb2b0fad82e5b7b27a3af82f24de61165d99fdc2703c3f3",
	name: "saveAddress",
	filename: "src/lib/server/commerce.ts"
}, (opts) => saveAddress.__executeServer(opts));
var saveAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveAddress_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const city = asCity(data.city);
	const line = data.address_line.trim();
	if (line.length < 8) throw new Error("Please write a full address.");
	if (data.is_default) await sql`update addresses set is_default = false where user_id = ${context.userId}`;
	if (data.id) await sql`
        update addresses set
          label = ${data.label.slice(0, 40)},
          name = ${data.name ?? null},
          phone = ${data.phone ?? null},
          address_line = ${line},
          city = ${city},
          is_default = ${Boolean(data.is_default)}
        where id = ${data.id} and user_id = ${context.userId}
      `;
	else await sql`
        insert into addresses (user_id, label, name, phone, address_line, city, is_default)
        values (
          ${context.userId}, ${data.label.slice(0, 40)}, ${data.name ?? null},
          ${data.phone ?? null}, ${line}, ${city}, ${Boolean(data.is_default)}
        )
      `;
	return { ok: true };
});
var deleteAddress_createServerFn_handler = createServerRpc({
	id: "9948bfb51ecb067a70b814031ef10de5a66044c1fabade56ffff63e04dab8c28",
	name: "deleteAddress",
	filename: "src/lib/server/commerce.ts"
}, (opts) => deleteAddress.__executeServer(opts));
var deleteAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(deleteAddress_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`delete from addresses where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { cancelGuestOrder_createServerFn_handler, cancelMyOrder_createServerFn_handler, deleteAddress_createServerFn_handler, joinList_createServerFn_handler, listMyAddresses_createServerFn_handler, placeGuestOrder_createServerFn_handler, placeSignedOrder_createServerFn_handler, previewQuote_createServerFn_handler, previewSignedQuote_createServerFn_handler, requestReturn_createServerFn_handler, saveAddress_createServerFn_handler, sendEnquiry_createServerFn_handler, trackEvent_createServerFn_handler, trackOrder_createServerFn_handler };
