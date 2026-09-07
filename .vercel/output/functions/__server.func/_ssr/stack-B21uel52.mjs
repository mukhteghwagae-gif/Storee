import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as Button, _ as useStorefront, f as useSitara, m as formatPkr } from "./router-Cj9UCdm1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stack-B21uel52.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StackPage() {
	const { products } = useStorefront();
	const stackable = products.filter((p) => p.stackable && (p.category === "ring" || p.category === "bangle"));
	const [picked, setPicked] = (0, import_react.useState)(["dawn-stack", "whisper-bangle"]);
	const addToCart = useSitara((s) => s.addToCart);
	const items = picked.map((s) => stackable.find((p) => p.slug === s)).filter(Boolean);
	const sub = items.reduce((s, p) => s + p.price, 0);
	const bundle = items.length >= 3 ? Math.round(sub * .9) : sub;
	const saved = sub - bundle;
	function toggle(slug) {
		setPicked((cur) => {
			if (cur.includes(slug)) return cur.filter((s) => s !== slug);
			if (cur.length >= 3) return [...cur.slice(1), slug];
			return [...cur, slug];
		});
	}
	const offsets = (0, import_react.useMemo)(() => [
		-18,
		0,
		18
	], []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.2em] text-stone",
				children: "Configurator"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl md:text-5xl",
				children: "Build your stack"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-ink-soft",
				children: "Choose up to three rings or bangles. Three together take ten percent off — the atelier’s only bundle."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid items-start gap-10 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl bg-ivory-deep",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/editorial/hand-stack.jpg",
						alt: "Hand",
						className: "aspect-[4/3] w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-x-0 bottom-6 flex justify-center gap-2",
						children: items.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.overlay ?? p.images[0],
							alt: p.name,
							className: "h-16 w-16 rounded-full object-cover shadow-sitara",
							style: { transform: `translateY(${offsets[i] ?? 0}px)` }
						}, p.slug))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: stackable.map((p) => {
						const on = picked.includes(p.slug);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => toggle(p.slug),
							className: cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left", on ? "border-emerald bg-card" : "border-border"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.images[0],
									alt: "",
									className: "size-14 rounded-md object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg leading-tight",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.14em] text-stone",
										children: p.category
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm tabular-nums",
									children: formatPkr(p.price)
								})
							]
						}) }, p.slug);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatPkr(sub)
							})]
						}),
						saved > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex justify-between text-sm text-emerald",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stack of three" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["−", formatPkr(saved)] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex justify-between font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bag total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatPkr(bundle)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4 w-full",
							disabled: items.length === 0,
							onClick: () => items.forEach((p) => addToCart(p.slug)),
							children: "Add stack to bag"
						})
					]
				})] })]
			})
		]
	});
}
//#endregion
export { StackPage as component };
