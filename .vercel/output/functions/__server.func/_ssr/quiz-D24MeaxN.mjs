import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as Button, _ as useStorefront } from "./router-Cj9UCdm1.mjs";
import { t as ProductCard } from "./product-card-C5FexRMX.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
import { a as quizResult } from "./recommendations-DWKZp0-I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz-D24MeaxN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Quiz() {
	const { products, productBySlug } = useStorefront();
	const [a, setA] = (0, import_react.useState)({
		day: "office",
		metal: "yellow",
		voice: "quiet",
		budget: "daily"
	});
	const [done, setDone] = (0, import_react.useState)(false);
	const result = quizResult(a, products);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: "Style quiz" }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-5xl",
				children: "Jewellery style quiz"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink-soft",
				children: "A short reading of the catalog. Not an algorithm with a marketing department."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, {
						label: "Most days",
						value: a.day,
						onChange: (day) => setA({
							...a,
							day
						}),
						options: [
							["office", "Office"],
							["home", "Home"],
							["events", "Events"]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, {
						label: "Metal",
						value: a.metal,
						onChange: (metal) => setA({
							...a,
							metal
						}),
						options: [
							["yellow", "Yellow gold"],
							["white", "White / silver"],
							["rose", "Rose"]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, {
						label: "Voice",
						value: a.voice,
						onChange: (voice) => setA({
							...a,
							voice
						}),
						options: [
							["quiet", "Quiet"],
							["one-piece", "One strong piece"],
							["heirloom", "Heirloom"]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Q, {
						label: "Spend",
						value: a.budget,
						onChange: (budget) => setA({
							...a,
							budget
						}),
						options: [["daily", "Daily gold"], ["invest", "Invest"]]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-8",
				onClick: () => setDone(true),
				children: "Read my tray"
			}),
			done && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.2em] text-stone",
						children: "Your room"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl",
						children: result.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-ink-soft",
						children: result.dek
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid grid-cols-2 gap-4",
						children: result.slugs.map((s) => productBySlug[s] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: productBySlug[s] }, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "mt-6 inline-block text-sm underline",
						children: "Browse the house"
					})
				]
			})
		]
	});
}
function Q({ label, value, onChange, options }) {
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
export { Quiz as component };
