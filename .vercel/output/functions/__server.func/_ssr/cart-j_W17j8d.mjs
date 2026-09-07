import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Button, _ as useStorefront, d as hydrateLines, f as useSitara, l as cartSubtotal, m as formatPkr, u as freeShippingGap } from "./router-Cj9UCdm1.mjs";
import { t as ProductCard } from "./product-card-C5FexRMX.mjs";
import { i as personalizedFromHistory } from "./recommendations-DWKZp0-I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-j_W17j8d.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const cart = useSitara((s) => s.cart);
	const setQty = useSitara((s) => s.setQty);
	const remove = useSitara((s) => s.remove);
	const giftWrap = useSitara((s) => s.giftWrap);
	const setGiftWrap = useSitara((s) => s.setGiftWrap);
	const recently = useSitara((s) => s.recentlyViewed);
	const { settings, productBySlug, products } = useStorefront();
	const lines = hydrateLines(cart, productBySlug);
	const sub = cartSubtotal(cart, productBySlug);
	const gap = freeShippingGap(sub, settings.free_shipping_over);
	const recs = personalizedFromHistory(recently, products, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Your bag"
			}),
			lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-ink-soft",
					children: "Nothing here yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						children: "Browse the house"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-stone",
					children: gap === 0 ? "Complimentary shipping unlocked." : `Add ${formatPkr(gap)} for complimentary shipping.`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 divide-y divide-border",
					children: lines.map(({ product, line }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.images[0],
							alt: "",
							className: "size-24 rounded-lg object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop/$slug",
									params: { slug: product.slug },
									className: "font-display text-2xl",
									children: product.name
								}),
								line.size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-stone",
									children: ["Size ", line.size]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tabular-nums",
									children: formatPkr(product.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "grid size-10 place-items-center",
											onClick: () => setQty(product.slug, line.size, line.qty - 1),
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums",
											children: line.qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "grid size-10 place-items-center",
											onClick: () => setQty(product.slug, line.size, line.qty + 1),
											children: "+"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "ml-auto text-xs uppercase tracking-[0.14em] text-stone",
											onClick: () => remove(product.slug, line.size),
											children: "Remove"
										})
									]
								})
							]
						})]
					}, `${product.slug}-${line.size ?? ""}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-6 flex items-center gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: giftWrap,
							onChange: (e) => setGiftWrap(e.target.checked)
						}),
						"Cedar gift wrap · ",
						formatPkr(settings.gift_wrap_pkr ?? 650)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatPkr(sub)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					size: "lg",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/checkout",
						children: "Checkout"
					})
				})
			] }),
			recs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "You were looking at"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-4",
					children: recs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			})
		]
	});
}
//#endregion
export { CartPage as component };
