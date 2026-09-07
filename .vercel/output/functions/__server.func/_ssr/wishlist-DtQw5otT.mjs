import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Button, _ as useStorefront, f as useSitara } from "./router-Cj9UCdm1.mjs";
import { t as ProductCard } from "./product-card-C5FexRMX.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-DtQw5otT.js
var import_jsx_runtime = require_jsx_runtime();
function Wishlist() {
	const wishlist = useSitara((s) => s.wishlist);
	const { productBySlug } = useStorefront();
	const items = wishlist.map((s) => productBySlug[s]).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: "Wishlist" }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-5xl",
				children: "Saved"
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-ink-soft",
					children: "Nothing saved yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						children: "Browse the house"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-4 md:grid-cols-4",
				children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			})
		]
	});
}
//#endregion
export { Wishlist as component };
