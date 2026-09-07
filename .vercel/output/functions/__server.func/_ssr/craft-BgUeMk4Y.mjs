import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Button } from "./router-Cj9UCdm1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/craft-BgUeMk4Y.js
var import_jsx_runtime = require_jsx_runtime();
function Craft() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative min-h-[70dvh] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					className: "absolute inset-0 h-full w-full object-cover",
					src: "/video/craft.mp4",
					autoPlay: true,
					muted: true,
					loop: true,
					playsInline: true,
					poster: "/editorial/craft.jpg"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/50" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex min-h-[70dvh] max-w-6xl flex-col justify-end px-4 pb-16 text-ivory",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.24em]",
						children: "The atelier"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-xl font-display text-5xl md:text-6xl",
						children: "Made in Pakistan. Marked as such."
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl",
					children: "A bench, not a factory"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 leading-relaxed text-ink-soft",
					children: "Sitara works with karigars in Lahore who still chase a seam by hand. Gold arrives as grain, becomes wire, becomes a gallery. Emeralds are bedded, not glued. If a piece cannot take a hallmark, we do not call it gold."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 leading-relaxed text-ink-soft",
					children: "You can visit on Tuesdays, by appointment. The light in the old city is the only marketing we trust."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/editorial/polish.jpg",
				alt: "Polishing a gold ring",
				className: "rounded-2xl object-cover"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-ivory-deep py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3",
				children: [
					["Hallmark", "22k and 925 pieces over two grams leave with a Karatstamp and our maker’s mark."],
					["Stone policy", "We name the gem honestly. Cubic zirconia is called light. Emerald is called emerald."],
					["Repair", "A lifetime of resizing and a complimentary first polish within a year."]
				].map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-ivory p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl",
						children: t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-ink-soft",
						children: d
					})]
				}, t))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-4xl",
				children: "See the work on a person"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						children: "Shop gold"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/try-on",
						children: "Try on"
					})
				})]
			})]
		})
	] });
}
//#endregion
export { Craft as component };
