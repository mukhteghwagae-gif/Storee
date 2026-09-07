import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$3 } from "./router-Cj9UCdm1.mjs";
import { n as ARTICLE_BY_SLUG, r as ARTICLE_CATEGORY, t as ARTICLES } from "./journal-BHL4o27Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal._slug-BacacRke.js
var import_jsx_runtime = require_jsx_runtime();
function Article() {
	const { slug } = Route$3.useParams();
	const a = ARTICLE_BY_SLUG[slug];
	if (!a) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Essay not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/journal",
			className: "mt-4 inline-block text-sm underline",
			children: "The Journal"
		})]
	});
	const more = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] uppercase tracking-[0.18em] text-stone",
				children: [
					ARTICLE_CATEGORY[a.category],
					" · ",
					a.date,
					" · ",
					a.readMin,
					" min"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl md:text-5xl",
				children: a.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg text-ink-soft",
				children: a.dek
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: a.image,
				alt: "",
				className: "mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-5 text-[17px] leading-relaxed text-ink-soft",
				children: a.body.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 24)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 border-t border-border pt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Continue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: more.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/journal/$slug",
						params: { slug: m.slug },
						className: "font-display text-xl",
						children: m.title
					}) }, m.slug))
				})]
			})
		]
	});
}
//#endregion
export { Article as component };
