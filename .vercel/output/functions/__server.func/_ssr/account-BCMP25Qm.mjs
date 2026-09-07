import { o as __toESM } from "../_runtime.mjs";
import { i as canRequestReturn, n as STATUS_LABEL, r as canCancel } from "./order-BuQcDLgy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as requestReturn, i as deleteAddress, n as cancelMyOrder, o as listMyAddresses, p as saveAddress } from "./commerce-BpEajYIO.mjs";
import { t as CITIES } from "./shipping-DOUYcwLY.mjs";
import { C as Button, S as updateProfile, _ as useStorefront, b as listMyOrders, f as useSitara, h as RedirectToSignIn, m as formatPkr, w as useCurrentUserState, y as getOrCreateProfile } from "./router-Cj9UCdm1.mjs";
import { t as Input } from "./input-BgwakZUo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-BCMP25Qm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Account() {
	const { user, isPending } = useCurrentUserState();
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [items, setItems] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("orders");
	const wishlist = useSitara((s) => s.wishlist);
	const { productBySlug } = useStorefront();
	const [copied, setCopied] = (0, import_react.useState)(false);
	function reload() {
		getOrCreateProfile().then(setProfile).catch(() => {});
		listMyOrders().then((d) => {
			setOrders(d.orders);
			setItems(d.items);
		}).catch(() => {});
	}
	(0, import_react.useEffect)(() => {
		if (!user) return;
		reload();
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-ivory-deep" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.2em] text-stone",
				children: "Account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: profile?.display_name || user.displayName || "Collector"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-stone",
				children: user.primaryEmail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Gold coins",
						value: String(profile?.coins ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Store credit",
						value: formatPkr(profile?.store_credit_pkr ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Orders",
						value: String(orders.length)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex flex-wrap gap-2",
				children: [
					"orders",
					"addresses",
					"saved",
					"rewards"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(t),
					className: `h-10 rounded-full px-4 text-xs uppercase tracking-[0.14em] ${tab === t ? "bg-emerald text-ivory" : "bg-ivory-deep"}`,
					children: t
				}, t))
			}),
			tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Orders"
					}),
					orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-stone",
						children: "No parcels yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl border border-border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-xl",
										children: o.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-[0.14em] text-stone",
										children: STATUS_LABEL[o.status] ?? o.status
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm tabular-nums",
									children: [
										formatPkr(o.total),
										" · ",
										o.payment_method,
										" · ",
										STATUS_LABEL[o.payment_status ?? ""] ?? o.payment_status,
										" · ",
										o.city
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 text-sm text-ink-soft",
									children: items.filter((it) => it.order_id === o.id).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										it.name,
										" × ",
										it.qty
									] }, it.name))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/track",
											search: { id: o.id },
											className: "text-xs uppercase tracking-[0.14em] underline",
											children: "Track"
										}),
										canCancel(o.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-xs uppercase tracking-[0.14em] underline",
											onClick: async () => {
												await cancelMyOrder({ data: { id: o.id } });
												reload();
											},
											children: "Cancel"
										}),
										canRequestReturn(o.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-xs uppercase tracking-[0.14em] underline",
											onClick: async () => {
												const reason = window.prompt("Why are you returning?");
												if (!reason) return;
												await requestReturn({ data: {
													id: o.id,
													reason
												} });
												reload();
											},
											children: "Request return"
										})
									]
								})
							]
						}, o.id))
					})
				]
			}),
			tab === "addresses" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileForm, {
				profile,
				onSaved: setProfile
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Addresses, {})] }),
			tab === "saved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Wishlist"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-3",
					children: [wishlist.map((slug) => {
						const p = productBySlug[slug];
						if (!p) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop/$slug",
							params: { slug },
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.images[0],
								alt: "",
								className: "size-16 rounded-md object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg leading-tight",
								children: p.name
							})]
						}, slug);
					}), wishlist.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-stone",
						children: "Nothing saved."
					})]
				})]
			}),
			tab === "rewards" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-2xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Refer a friend"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: [
							"She places her first order with your code. You receive ",
							formatPkr(500),
							" credit."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "flex-1 rounded-lg bg-ivory-deep px-3 py-3 text-sm",
							children: profile?.referral_code ?? "…"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => {
								if (!profile?.referral_code) return;
								navigator.clipboard.writeText(profile.referral_code);
								setCopied(true);
							},
							children: copied ? "Copied" : "Copy"
						})]
					})
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-[0.16em] text-stone",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-3xl",
			children: value
		})]
	});
}
function ProfileForm({ profile, onSaved }) {
	const [display_name, setName] = (0, import_react.useState)(profile?.display_name ?? "");
	const [phone, setPhone] = (0, import_react.useState)(profile?.phone ?? "");
	const [address_line, setAddress] = (0, import_react.useState)(profile?.address_line ?? "");
	const [city, setCity] = (0, import_react.useState)(profile?.city ?? "");
	(0, import_react.useEffect)(() => {
		setName(profile?.display_name ?? "");
		setPhone(profile?.phone ?? "");
		setAddress(profile?.address_line ?? "");
		setCity(profile?.city ?? "");
	}, [profile]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-8 space-y-3",
		onSubmit: async (e) => {
			e.preventDefault();
			const p = await updateProfile({ data: {
				display_name,
				phone,
				address_line,
				city
			} });
			if (p) onSaved(p);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Details"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Name",
				value: display_name,
				onChange: (e) => setName(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Phone",
				value: phone,
				onChange: (e) => setPhone(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Address",
				value: address_line,
				onChange: (e) => setAddress(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: city,
				onChange: (e) => setCity(e.target.value),
				className: "sitara-select",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "City"
				}), CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Save"
			})
		]
	});
}
function Addresses() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [label, setLabel] = (0, import_react.useState)("Home");
	const [line, setLine] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("Lahore");
	const reload = () => listMyAddresses().then(setRows).catch(() => {});
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Addresses"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: rows.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start justify-between gap-3 rounded-xl border border-border p-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: a.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-ink-soft",
						children: [
							a.address_line,
							", ",
							a.city
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs uppercase tracking-[0.14em] text-stone",
						onClick: () => deleteAddress({ data: { id: a.id } }).then(reload),
						children: "Remove"
					})]
				}, a.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 space-y-3",
				onSubmit: async (e) => {
					e.preventDefault();
					await saveAddress({ data: {
						label,
						address_line: line,
						city,
						is_default: rows.length === 0
					} });
					setLine("");
					reload();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Label",
						value: label,
						onChange: (e) => setLabel(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Address",
						value: line,
						onChange: (e) => setLine(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: city,
						onChange: (e) => setCity(e.target.value),
						className: "sitara-select",
						children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "outline",
						children: "Add address"
					})
				]
			})
		]
	});
}
//#endregion
export { Account as component };
