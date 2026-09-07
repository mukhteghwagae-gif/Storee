import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { d as authMiddleware } from "./catalog-BkM9Pw9j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/commerce-BpEajYIO.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var previewQuote = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("10e38fdf221bcc8bac18c3c1b8e23244bb6dc284a3df824b4cc716bfd6dedc73"));
var previewSignedQuote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("23b606d10058aaf6122fc56774c415671abef9bfde39443bcd992c9a17af80ee"));
var placeGuestOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("c0855ed94dc00d17fbf129a2e4f168f679f21d6e5c3b00e1ea3deba136289ef2"));
var placeSignedOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("f025e22565a163e5462519618a3aefbaec1df9f177ff6f2d05b84fcbf334ae1e"));
var trackOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f37d3f17b3dc0705b699128f26d2418832b8ee937e502eeb891aedc2c864c90d"));
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
var cancelMyOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("2f83125957602c5c313ae3dbe05862640a95f58868ac8602384ca8b8dd7d3005"));
var cancelGuestOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("db0827fe2a85d64e9958ff858e5a8fe0357bcc1d6428f1e0acfb778fe89b7633"));
var requestReturn = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("bc37617d9633340add2356a546ee38dc0d9827238af5009888ae01e6f9cc27fd"));
var joinList = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("5d3497d89a257a82be2f4c2ae350101b379a876b43f509ebddc73e56e107aba0"));
var sendEnquiry = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("5eb6d1e38cc352da17b800b5c57aece58ad10f2fc35aeb873c632c33e4a9573f"));
var trackEvent = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("1d440c15eab6dc0769e3ae53d8d6e4659e14e769100065fd75c0aa55c93b56c8"));
var listMyAddresses = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("36dcab8cc1a06d7e71106dff705d1fcf1e3bada5136e6e7193d2b217aaeef43f"));
var saveAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("118760e18905b9f60eb2b0fad82e5b7b27a3af82f24de61165d99fdc2703c3f3"));
var deleteAddress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9948bfb51ecb067a70b814031ef10de5a66044c1fabade56ffff63e04dab8c28"));
//#endregion
export { joinList as a, placeSignedOrder as c, requestReturn as d, restock as f, trackOrder as g, trackEvent as h, deleteAddress as i, previewQuote as l, sendEnquiry as m, cancelMyOrder as n, listMyAddresses as o, saveAddress as p, createSsrRpc as r, placeGuestOrder as s, cancelGuestOrder as t, previewSignedQuote as u };
