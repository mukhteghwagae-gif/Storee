import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as Button, _ as useStorefront } from "./router-Cj9UCdm1.mjs";
import { t as ProductCard } from "./product-card-C5FexRMX.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
import { r as matchLook } from "./recommendations-DWKZp0-I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/match-1271UD_W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Match() {
	const { products } = useStorefront();
	const [a, setA] = (0, import_react.useState)({
		occasion: "everyday",
		palette: "warm",
		neckline: "open"
	});
	const [shown, setShown] = (0, import_react.useState)(false);
	const found = matchLook(a, products);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: "Outfit matcher" }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-5xl",
				children: "Outfit & colour matcher"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink-soft",
				children: "Warm gold on ivory. Cool silver on midnight. A blush chain on rose silk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Occasion",
						value: a.occasion,
						onChange: (occasion) => setA({
							...a,
							occasion
						}),
						options: [
							["everyday", "Everyday"],
							["office", "Office"],
							["party", "Party"],
							["bridal", "Bridal"]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Cloth colour",
						value: a.palette,
						onChange: (palette) => setA({
							...a,
							palette
						}),
						options: [
							["warm", "Warm / ivory / mustard"],
							["cool", "Cool / black / ice"],
							["blush", "Blush / rose"]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						label: "Neckline",
						value: a.neckline,
						onChange: (neckline) => setA({
							...a,
							neckline
						}),
						options: [
							["open", "Open"],
							["high", "High / collared"],
							["none", "No necklace"]
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-8",
				onClick: () => setShown(true),
				children: "Match"
			}),
			shown && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid grid-cols-2 gap-4",
				children: [found.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "col-span-2 text-sm text-stone",
					children: "No exact match. Try another colour."
				}), found.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))]
			})
		]
	});
}
function Row({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-[11px] uppercase tracking-[0.16em] text-stone",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children: options.map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(v),
			className: cn("h-10 rounded-full px-4 text-sm", value === v ? "bg-emerald text-ivory" : "bg-ivory-deep"),
			children: l
		}, v))
	})] });
}
//#endregion
export { Match as component };
