import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useStorefront } from "./router-Cj9UCdm1.mjs";
import { t as CatalogPage } from "./catalog-page-BPXTAMFs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/arrivals-CM9K70Ov.js
var import_jsx_runtime = require_jsx_runtime();
function Arrivals() {
	const { products } = useStorefront();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogPage, {
		kicker: "Just in",
		title: "New arrivals",
		dek: "What left the bench this season.",
		products: products.filter((p) => p.newest),
		crumbs: [{
			to: "/shop",
			label: "Shop"
		}, { label: "New arrivals" }]
	});
}
//#endregion
export { Arrivals as component };
