import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as ARTICLE_CATEGORY, t as ARTICLES } from "./journal-BHL4o27Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal.index-Cz9GjkVH.js
var import_jsx_runtime = require_jsx_runtime();
function Journal() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.2em] text-stone",
				children: "The Journal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl",
				children: "Style, care, the bench"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-ink-soft",
				children: "Couture week notes, how to wash silver without erasing it, and the looks we would actually wear on a Tuesday."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-8 md:grid-cols-2",
				children: ARTICLES.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/journal/$slug",
					params: { slug: a.slug },
					className: "block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: a.image,
							alt: "",
							className: "aspect-[16/9] w-full rounded-2xl object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-[11px] uppercase tracking-[0.16em] text-stone",
							children: [
								ARTICLE_CATEGORY[a.category],
								" · ",
								a.readMin,
								" min"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-3xl leading-tight",
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-ink-soft",
							children: a.dek
						})
					]
				}, a.slug))
			})
		]
	});
}
//#endregion
export { Journal as component };
