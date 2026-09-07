import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lookbook-DN5Rytjp.js
var import_jsx_runtime = require_jsx_runtime();
function Lookbook() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.2em] text-stone",
				children: "Lookbook"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl",
				children: "Worn, not staged"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 columns-1 gap-4 md:columns-2",
				children: [
					{
						src: "/editorial/hero.jpg",
						cap: "Emerald silk, 22k haar"
					},
					{
						src: "/editorial/bridal.jpg",
						cap: "Courtyard, morning"
					},
					{
						src: "/editorial/lookbook.jpg",
						cap: "Tuesday gold"
					},
					{
						src: "/editorial/hand-stack.jpg",
						cap: "The stack"
					},
					{
						src: "/editorial/everyday.jpg",
						cap: "Chai and a chain"
					},
					{
						src: "/products/lahore-jhumkas.jpg",
						cap: "Lahore jhumkas"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "mb-4 break-inside-avoid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.src,
						alt: s.cap,
						className: "w-full rounded-2xl object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "mt-2 text-sm text-stone",
						children: s.cap
					})]
				}, s.src))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-8 inline-block text-sm underline",
				children: "Shop the house"
			})
		]
	});
}
//#endregion
export { Lookbook as component };
