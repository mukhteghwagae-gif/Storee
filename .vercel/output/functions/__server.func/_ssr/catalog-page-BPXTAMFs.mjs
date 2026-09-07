import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as ProductCard } from "./product-card-C5FexRMX.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-page-BPXTAMFs.js
var import_jsx_runtime = require_jsx_runtime();
function CatalogPage({ kicker, title, dek, products, crumbs }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: crumbs }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-[11px] uppercase tracking-[0.2em] text-stone",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl md:text-5xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-ink-soft",
				children: dek
			}),
			products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-12 text-sm text-stone",
				children: "Nothing on this tray yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6",
				children: products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product: p,
					priority: i < 4
				}, p.slug))
			})
		]
	});
}
//#endregion
export { CatalogPage as t };
