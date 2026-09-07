import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { b as Heart, d as ScanLine, o as ShoppingBag } from "../_libs/lucide-react.mjs";
import { f as useSitara, g as useStock, m as formatPkr } from "./router-Cj9UCdm1.mjs";
import { g as tryOnZoneFor } from "./intelligence-wVEiNvGR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-C5FexRMX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, priority }) {
	const [hover, setHover] = (0, import_react.useState)(false);
	const stock = useStock(product.slug);
	const wishlist = useSitara((s) => s.wishlist);
	const toggleWish = useSitara((s) => s.toggleWish);
	const addToCart = useSitara((s) => s.addToCart);
	const wished = wishlist.includes(product.slug);
	const img = hover && product.hoverImage ? product.hoverImage : product.images[0];
	const needsSize = product.sizeType === "ring" || product.sizeType === "bangle";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative",
		onMouseEnter: () => setHover(true),
		onMouseLeave: () => setHover(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop/$slug",
				params: { slug: product.slug },
				className: "block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-[3/4] overflow-hidden rounded-xl bg-ivory-deep",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img,
								alt: product.name,
								width: 600,
								height: 800,
								loading: priority ? "eager" : "lazy",
								decoding: "async",
								className: "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
							}),
							stock > 0 && stock <= 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute left-3 top-3 rounded-md bg-ivory/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ink",
								children: [
									"Only ",
									stock,
									" left"
								]
							}),
							stock <= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-0 grid place-items-center bg-ink/35 text-xs uppercase tracking-[0.2em] text-ivory",
								children: "Waitlist"
							}),
							product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-3 top-3 rounded-md bg-emerald px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ivory",
								children: "Courtesy"
							}),
							tryOnZoneFor(product) && !product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute left-3 bottom-3 rounded-md bg-ivory/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "mr-1 inline size-3" }), "Try on"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg leading-tight text-ink",
							children: product.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-[11px] uppercase tracking-[0.18em] text-stone",
							children: [
								product.karat ?? product.metal,
								" · ",
								product.collection.replace(/-/g, " ")
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "shrink-0 text-sm tabular-nums text-ink",
							children: formatPkr(product.price)
						})]
					}),
					product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-stone line-through tabular-nums",
						children: formatPkr(product.compareAt)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute right-3 top-3 flex flex-col gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": wished ? "Remove from wishlist" : "Save",
					onClick: () => toggleWish(product.slug),
					className: cn("grid size-11 place-items-center rounded-full bg-ivory/90 text-ink shadow-sitara transition-transform duration-150", wished && "text-emerald"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", wished && "fill-current") })
				})
			}),
			needsSize ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop/$slug",
				params: { slug: product.slug },
				className: "absolute bottom-16 left-3 right-3 flex h-11 translate-y-3 items-center justify-center gap-2 rounded-lg bg-ink text-sm text-ivory opacity-0 pointer-events-none transition-[opacity,transform] duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-md:pointer-events-auto max-md:static max-md:mt-3 max-md:translate-y-0 max-md:opacity-100",
				children: "Choose size"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: stock <= 0,
				onClick: () => addToCart(product.slug),
				className: "absolute bottom-16 left-3 right-3 flex h-11 translate-y-3 items-center justify-center gap-2 rounded-lg bg-ink text-sm text-ivory opacity-0 pointer-events-none transition-[opacity,transform] duration-200 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 max-md:pointer-events-auto max-md:static max-md:mt-3 max-md:translate-y-0 max-md:opacity-100",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }), stock <= 0 ? "Notify" : "Quick add"]
			})
		]
	});
}
//#endregion
export { ProductCard as t };
