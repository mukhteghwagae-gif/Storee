import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useStorefront } from "./router-Cj9UCdm1.mjs";
import { t as CatalogPage } from "./catalog-page-BPXTAMFs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bestsellers-C4LFS_7A.js
var import_jsx_runtime = require_jsx_runtime();
function Bestsellers() {
	const { products } = useStorefront();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogPage, {
		kicker: "The tray",
		title: "Best sellers",
		dek: "Pieces the house stands behind — not a fabricated sales rank.",
		products: products.filter((p) => p.bestSeller),
		crumbs: [{
			to: "/shop",
			label: "Shop"
		}, { label: "Best sellers" }]
	});
}
//#endregion
export { Bestsellers as component };
