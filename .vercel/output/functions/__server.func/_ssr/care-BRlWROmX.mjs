import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/care-BRlWROmX.js
var import_jsx_runtime = require_jsx_runtime();
function Care() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: "Care" }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-5xl",
				children: "How to keep it"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6 leading-relaxed text-ink-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Gold likes warmth. A bowl of lukewarm water, a drop of dish soap, a soft brush along the gallery. Rinse. Pat. A jeweller’s cloth once a month." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Oxidized silver is meant to be dark in the recesses. Do not boil it in foil and soda. Wipe with microfibre, then a drop of mild soap, then dry like you mean it." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Never toothpaste. Never lemon on stones. Never perfume on a chain still around the neck." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Hallmarked 22k may be worn daily. Plated pieces are anti-tarnish; still, take them off for the pool." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"A longer method lives in",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/journal/$slug",
							params: { slug: "how-to-clean-silver-at-home" },
							className: "underline",
							children: "the Journal"
						}),
						"."
					] })
				]
			})
		]
	});
}
//#endregion
export { Care as component };
