import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-BP8Sg7MF.mjs";
import { C as Button } from "./router-Cj9UCdm1.mjs";
import { t as Input } from "./input-BgwakZUo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-IAWQ9bHT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			if (mode === "up") {
				const res = await authClient.signUp.email({
					email,
					password,
					name: name || "Sitara guest"
				});
				if (res.error) throw new Error(res.error.message || "Could not create account");
			} else {
				const res = await authClient.signIn.email({
					email,
					password
				});
				if (res.error) throw new Error(res.error.message || "Could not sign in");
			}
			window.location.assign("/account");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/editorial/craft.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/55" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mb-8 text-center font-display text-4xl tracking-[0.22em] text-ivory",
					children: "SITARA"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-ivory p-6 shadow-sitara",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl",
							children: mode === "in" ? "Enter the house" : "Open an account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-stone",
							children: "Gold coins on first sign-in. Orders, waitlists, and referrals live here."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex flex-col gap-2",
								children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									className: "w-full",
									onClick: () => signIn(p.providerId, { callbackURL: "/account" }),
									children: ["Continue with ", p.label]
								}, p.providerId))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "my-4 text-center text-[11px] uppercase tracking-[0.18em] text-stone",
								children: "or email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit,
								className: "space-y-3",
								children: [
									mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Name",
										value: name,
										onChange: (e) => setName(e.target.value),
										autoComplete: "name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										required: true,
										placeholder: "Email",
										value: email,
										onChange: (e) => setEmail(e.target.value),
										autoComplete: "email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "password",
										required: true,
										minLength: 8,
										placeholder: "Password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										autoComplete: mode === "up" ? "new-password" : "current-password"
									}),
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-destructive",
										children: error
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "w-full",
										disabled: busy,
										children: busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-4 w-full text-sm text-stone",
								onClick: () => setMode(mode === "in" ? "up" : "in"),
								children: mode === "in" ? "New to Sitara? Create an account" : "Already with us? Sign in"
							})
						] })
					]
				})]
			})
		]
	});
}
//#endregion
export { Login as component };
