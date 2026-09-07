import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as useStorefront } from "./router-Cj9UCdm1.mjs";
import { t as CatalogPage } from "./catalog-page-BPXTAMFs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bridal-CEeoEPQN.js
var import_jsx_runtime = require_jsx_runtime();
function Bridal() {
	const { products } = useStorefront();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogPage, {
		kicker: "Trousseau",
		title: "Bridal Couture",
		dek: "Closed chokers, a tikka, kangan. Pieces wrought for a lifetime, not a single stage.",
		products: products.filter((p) => p.occasion.includes("bridal")),
		crumbs: [{
			to: "/shop",
			label: "Shop"
		}, { label: "Bridal" }]
	});
}
//#endregion
export { Bridal as component };
