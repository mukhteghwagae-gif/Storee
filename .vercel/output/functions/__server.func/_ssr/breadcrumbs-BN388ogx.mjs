import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/breadcrumbs-BN388ogx.js
var import_jsx_runtime = require_jsx_runtime();
function Breadcrumbs({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Breadcrumb",
		className: "text-[11px] uppercase tracking-[0.18em] text-stone",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: "Home"
			}) }), items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: "·"
				}), it.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: it.to,
					children: it.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-ink",
					children: it.label
				})]
			}, it.label))]
		})
	});
}
//#endregion
export { Breadcrumbs as t };
