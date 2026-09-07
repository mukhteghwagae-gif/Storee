import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Input } from "./input-BgwakZUo.mjs";
import { i as convertRingSize, n as PK_SIZES, r as circumferenceToPk } from "./sizes-36DjQiLN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/size-guide-CUBCymKZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SizeGuide() {
	const [from, setFrom] = (0, import_react.useState)("UK");
	const [value, setValue] = (0, import_react.useState)("M");
	const [mm, setMm] = (0, import_react.useState)("54.4");
	const converted = convertRingSize(value, from);
	const fromMm = circumferenceToPk(Number(mm) || 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.2em] text-stone",
				children: "Fit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Ring size guide"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink-soft",
				children: "Pakistani jewellers number from the inside circumference. Use the converter if you only know UK or US."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.16em] text-stone",
							children: "Convert"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: from,
							onChange: (e) => setFrom(e.target.value),
							className: "sitara-select mt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "PK",
									children: "Pakistan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "UK",
									children: "United Kingdom"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "US",
									children: "United States"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-3",
							value,
							onChange: (e) => setValue(e.target.value)
						}),
						converted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm",
							children: [
								"PK ",
								converted.pk,
								" · UK ",
								converted.uk,
								" · US ",
								converted.us,
								" · ",
								converted.mm,
								" mm"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.16em] text-stone",
							children: "From a paper strip (mm)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-3",
							value: mm,
							onChange: (e) => setMm(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm",
							children: [
								"Closest PK ",
								fromMm.pk,
								" · UK ",
								fromMm.uk,
								" · US ",
								fromMm.us
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "mt-10 w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-[11px] uppercase tracking-[0.14em] text-stone",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2",
							children: "PK"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "UK" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "US" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Circumference" })
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: PK_SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2",
							children: s.pk
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.uk }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.us }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "tabular-nums",
							children: [s.mm.toFixed(1), " mm"]
						})
					]
				}, s.pk)) })]
			})
		]
	});
}
//#endregion
export { SizeGuide as component };
