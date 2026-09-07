import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as COLLECTIONS } from "./catalog-BkM9Pw9j.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections-CtALNpxH.js
var import_jsx_runtime = require_jsx_runtime();
var IMAGES = {
	"bridal-couture": "/editorial/bridal.jpg",
	"everyday-gold": "/editorial/everyday.jpg",
	"office-edit": "/editorial/lookbook.jpg",
	"party-lights": "/products/emerald-teardrop.jpg",
	"silver-stones": "/products/moonlight-choker.jpg",
	"stack-layer": "/editorial/hand-stack.jpg"
};
function Collections() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: "Collections" }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-5xl",
				children: "A house in six rooms"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-6 md:grid-cols-3",
				children: COLLECTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/collections/$slug",
					params: { slug: c.slug },
					className: "group relative overflow-hidden rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: IMAGES[c.slug],
							alt: "",
							className: "aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-4 left-4 right-4 text-ivory",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-ivory/80",
								children: c.blurb
							})]
						})
					]
				}, c.slug))
			})
		]
	});
}
//#endregion
export { Collections as component };
