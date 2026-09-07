import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as COLLECTIONS } from "./catalog-BkM9Pw9j.mjs";
import { C as Button, _ as useStorefront, i as Route$5 } from "./router-Cj9UCdm1.mjs";
import { t as CatalogPage } from "./catalog-page-BPXTAMFs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections._slug-CnhwcZuF.js
var import_jsx_runtime = require_jsx_runtime();
function Collection() {
	const { slug } = Route$5.useParams();
	const col = COLLECTIONS.find((c) => c.slug === slug);
	const { products } = useStorefront();
	if (!col) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "That room is closed"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/collections",
				children: "Collections"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogPage, {
		kicker: "Collection",
		title: col.name,
		dek: col.blurb,
		products: products.filter((p) => p.collection === col.slug),
		crumbs: [{
			to: "/collections",
			label: "Collections"
		}, { label: col.name }]
	});
}
//#endregion
export { Collection as component };
