import { o as __toESM } from "../_runtime.mjs";
import { n as STATUS_LABEL } from "./order-BuQcDLgy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as trackOrder } from "./commerce-BpEajYIO.mjs";
import { C as Button, m as formatPkr, s as Route$9 } from "./router-Cj9UCdm1.mjs";
import { t as Input } from "./input-BgwakZUo.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-DUaeNRGM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Track() {
	const { id: initial } = Route$9.useSearch();
	const [id, setId] = (0, import_react.useState)(initial ?? "");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const data = await trackOrder({ data: {
				id,
				phone
			} });
			setResult(data);
		} catch (err) {
			setResult(null);
			setError(err instanceof Error ? err.message : "Not found");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: "Track" }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-4xl",
				children: "Track a parcel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-ink-soft",
				children: "Enter the order number or token and the mobile used at checkout. Live courier scans are not connected — you see the atelier’s desk status only."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "ST-… or token",
						value: id,
						onChange: (e) => setId(e.target.value),
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "03XXXXXXXXX",
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						required: true
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						className: "w-full",
						children: busy ? "Looking…" : "Look up"
					})
				]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-2xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: result.order.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-stone",
						children: [
							STATUS_LABEL[result.order.status] ?? result.order.status,
							" · ",
							STATUS_LABEL[result.order.payment_status ?? ""] ?? result.order.payment_status,
							" · ",
							formatPkr(result.order.total)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: result.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							it.name,
							" × ",
							it.qty,
							" · ",
							formatPkr(it.unit_price)
						] }, it.product_id + (it.size ?? "")))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-6 space-y-2 border-t border-border pt-4 text-sm",
						children: [result.events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-stone",
							children: "No desk notes yet."
						}), result.events.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "uppercase tracking-[0.12em] text-stone",
							children: STATUS_LABEL[ev.status] ?? ev.status
						}), ev.note ? ` · ${ev.note}` : ""] }, i))]
					})
				]
			})
		]
	});
}
//#endregion
export { Track as component };
