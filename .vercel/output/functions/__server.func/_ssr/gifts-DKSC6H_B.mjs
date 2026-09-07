import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Button, _ as useStorefront } from "./router-Cj9UCdm1.mjs";
import { t as CatalogPage } from "./catalog-page-BPXTAMFs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gifts-DKSC6H_B.js
var import_jsx_runtime = require_jsx_runtime();
function Gifts() {
	const { products } = useStorefront();
	const list = products.filter((p) => p.price <= 8e4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogPage, {
		kicker: "Gifts",
		title: "A present that will be worn",
		dek: "Under Rs 80,000, and the quiet pieces that survive a Tuesday. For a finder that asks four questions, open the Gift Finder.",
		products: list,
		crumbs: [{
			to: "/shop",
			label: "Shop"
		}, { label: "Gifts" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-6xl px-4 pb-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/finder",
				children: "Open the Gift Finder"
			})
		})
	})] });
}
//#endregion
export { Gifts as component };
