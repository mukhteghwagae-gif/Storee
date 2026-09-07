import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import "./catalog-BkM9Pw9j.mjs";
import { m as sendEnquiry } from "./commerce-BpEajYIO.mjs";
import { C as Button, _ as useStorefront } from "./router-Cj9UCdm1.mjs";
import { t as Input } from "./input-BgwakZUo.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-KJAwAb14.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const { settings } = useStorefront();
	const wa = settings.whatsapp_number || "923001112223";
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await sendEnquiry({ data: {
				name,
				email,
				phone,
				message
			} });
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not send");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: "Contact" }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-5xl",
				children: "The desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-md leading-relaxed text-ink-soft",
				children: "Sitara is a Lahore house. Write, or WhatsApp. We do not pretend a mail server is connected — your note is stored for the atelier and you may copy it to WhatsApp in one tap."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `https://wa.me/${wa}`,
				className: "mt-6 inline-flex h-11 items-center rounded-lg bg-emerald px-5 text-sm text-ivory",
				target: "_blank",
				rel: "noreferrer",
				children: "WhatsApp the atelier"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-stone",
				children: "Tuesdays, by appointment, old city light. GST invoice on request."
			})
		] }), done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "self-center font-display text-3xl",
			children: "Received. We will answer on WhatsApp if you left a number."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					placeholder: "Name",
					value: name,
					onChange: (e) => setName(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					placeholder: "Email",
					value: email,
					onChange: (e) => setEmail(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "03XXXXXXXXX",
					value: phone,
					onChange: (e) => setPhone(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					required: true,
					value: message,
					onChange: (e) => setMessage(e.target.value),
					placeholder: "How may we help?",
					className: "min-h-36 w-full rounded-lg border border-border bg-card p-3 text-sm"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Sending…" : "Leave a note"
				})
			]
		})]
	});
}
//#endregion
export { Contact as component };
