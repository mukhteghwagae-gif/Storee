import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CATEGORY_LABEL } from "./catalog-BkM9Pw9j.mjs";
import { C as Button, _ as useStorefront, a as Route$6 } from "./router-Cj9UCdm1.mjs";
import { t as CatalogPage } from "./catalog-page-BPXTAMFs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-tWIwhNth.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { slug } = Route$6.useParams();
	const label = CATEGORY_LABEL[slug];
	const { products } = useStorefront();
	if (!label) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Unknown category"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				children: "Shop"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogPage, {
		kicker: "Category",
		title: label,
		dek: `Every ${label.toLowerCase()} currently on the tray.`,
		products: products.filter((p) => p.category === slug),
		crumbs: [{
			to: "/shop",
			label: "Shop"
		}, { label }]
	});
}
//#endregion
export { CategoryPage as component };
