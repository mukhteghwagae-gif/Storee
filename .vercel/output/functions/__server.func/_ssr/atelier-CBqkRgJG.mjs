import { o as __toESM } from "../_runtime.mjs";
import { n as STATUS_LABEL, t as NEXT_STATUS } from "./order-BuQcDLgy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { d as authMiddleware, n as COLLECTIONS, t as CATEGORY_LABEL } from "./catalog-BkM9Pw9j.mjs";
import { r as createSsrRpc } from "./commerce-BpEajYIO.mjs";
import { C as Button, _ as useStorefront, h as RedirectToSignIn, m as formatPkr, w as useCurrentUserState } from "./router-Cj9UCdm1.mjs";
import { t as Input } from "./input-BgwakZUo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/atelier-CBqkRgJG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var staffStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("3bd433209f0a6c0e125b0ce1188e64dc355b6b73d6702e6b6ca4fac0f85871a8"));
var claimAtelier = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("6619c03802a6c9e977f40f112266380dba443e908c5ca60fb346c4171b62c748"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8d9edc443551f98e947b4cabf0d4e2178e83dafe1fece7513c8f6a786ccbf02a"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9bf07e8d117bfda86feafad3b833a921e032fdddca5aee616a509ce998957317"));
var listAllOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5967351cde5a35c11906b117563bb13d44cdb9ede8345b5910c65c9bf3ab6ba5"));
var setOrderStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5270b1ef1a6ea190f1be2ce7b1d6b2c59003a8e61c7e32d52845e832529e5a58"));
var confirmPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9dbe3ec74afb065e4674cf9d36bff7cc0c6b0e6d20144d09b7c4d6798ba5ae5e"));
var dashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5feaca4936912143d52b3a45870244df1c11241858cfde1f3b9acf432b7e1cd5"));
var listCatalogAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("78b0bd1c885775a543602216ac7dea30569c91ee99d32771bb4f1d31ddc1c2ea"));
var saveProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c4aae746ec01594c928a931887e3cef55f36ca20041da203c188438e768141ea"));
var listCustomers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1baded16fbb9c94f3b63b4b1ac24fe22a18ff4da83a4d49f75c28f03f48384a6"));
var listCoupons = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("934b62f0d81d5a4cb09a3c17ec638c2fb55d77232a220414a7f964abfb13324c"));
var saveCoupon = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("414389423e2928dbb578906e4567ad7b203f1a4d65e02ebaa070365826f3fe63"));
var listEnquiries = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("94603f7e3a4f63b3d4915a78c36ef3cbb6b2a26be5d3b3af241b6773761f7f94"));
var listAbandoned = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("baa1b71d7adf02fec382b9be70eb5ce14329c04ca4fadb3080e045bda5d6cb1b"));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c2e088d673ccff2c8e6325f78aa413af66c01db491d13cf76f532e67bb73b352"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5673260c1b24e534aa4facd9f5d95e912c0e8fc0024ea19f5662ae005c5bd7ce"));
var listReviewsAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("17b75806be9f53d423c8a02ca1e4f3330a37559fd15b7fade0c6bc4f8d736078"));
var deleteReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e0ee6ac95453c8a25c68385b7553352e3ffdfa2ada0808cf9fffab4ef0555b18"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9d83cf47d650f6079afd6505dcafe917ce9b046021243aa5ac3601ebd2fe6615"));
function Atelier() {
	const { user, isPending } = useCurrentUserState();
	const [status, setStatus] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("dashboard");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		staffStatus().then(setStatus).catch(() => setStatus({
			isStaff: false,
			open: false,
			role: null
		}));
	}, [user]);
	if (isPending || user && !status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-ivory-deep" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!status?.isStaff) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.2em] text-stone",
				children: "Private office"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Atelier"
			}),
			status?.open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-ink-soft",
				children: "This house has no keeper yet. Claiming it makes you the only merchant who can edit stock, prices, and orders."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				onClick: async () => {
					await claimAtelier();
					setStatus({
						isStaff: true,
						open: false,
						role: "owner"
					});
				},
				children: "Claim the atelier"
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-ink-soft",
				children: "This office is private. Ask the keeper to add you as staff."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] uppercase tracking-[0.2em] text-stone",
				children: ["Private office · ", status.role]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Atelier"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [
					"dashboard",
					"products",
					"orders",
					"customers",
					"reviews",
					"coupons",
					"enquiries",
					"settings"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(t),
					className: `h-10 rounded-full px-4 text-xs uppercase tracking-[0.14em] ${tab === t ? "bg-emerald text-ivory" : "bg-ivory-deep"}`,
					children: t
				}, t))
			}),
			tab === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dash, {}),
			tab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Products, {}),
			tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Orders, {}),
			tab === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Customers, {}),
			tab === "reviews" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, {}),
			tab === "coupons" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coupons, {}),
			tab === "enquiries" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Enquiries, {}),
			tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {})
		]
	});
}
function Dash() {
	const [data, setData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		dashboard().then(setData).catch(() => {});
	}, []);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-8 text-sm text-stone",
		children: "Loading desk…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Orders",
						value: String(data.orders)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Revenue (placed)",
						value: formatPkr(data.revenue)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Pending",
						value: String(data.pending)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Abandoned bags",
						value: String(data.abandoned)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-stone",
				children: "Revenue is the sum of placed orders, including unpaid COD. It is not a bank balance."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Low stock"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 text-sm",
				children: [data.lowStock.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-stone",
					children: "None under 3."
				}), data.lowStock.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					s.id,
					" · ",
					s.stock
				] }, s.id))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Events recorded"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-3 text-sm",
				children: [data.events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-stone",
					children: "No analytics events yet."
				}), data.events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					e.name,
					" · ",
					e.n
				] }, e.name))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Abandoned, {})
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
function Abandoned() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listAbandoned().then(setRows).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl",
			children: "Abandoned bags"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-stone",
			children: "Email recovery is not connected. These snapshots wait on the desk."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2 text-sm",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-lg border border-border p-3",
				children: [
					r.user_id,
					" · ",
					r.updated_at
				]
			}, r.user_id))
		})
	] });
}
function Products() {
	const { refresh } = useStorefront();
	const [products, setProducts] = (0, import_react.useState)([]);
	const [published, setPublished] = (0, import_react.useState)({});
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [stock, setStockVal] = (0, import_react.useState)(0);
	const [on, setOn] = (0, import_react.useState)(true);
	function reload() {
		listCatalogAdmin().then((d) => {
			setProducts(d.products);
			setPublished(d.published);
		}).catch(() => {});
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Products"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setEdit({
						slug: "",
						name: "",
						collection: "everyday-gold",
						category: "ring",
						metal: "gold",
						karat: "22k",
						gemstone: null,
						occasion: ["everyday"],
						price: 0,
						weightG: 0,
						makingPkr: 0,
						hallmarked: true,
						antiTarnish: true,
						images: ["/products/dawn-stack.jpg"],
						description: "",
						details: [],
						completeTheLook: [],
						defaultStock: 1,
						sizeType: "none"
					}),
					children: "New piece"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "mt-4 w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-[11px] uppercase tracking-[0.14em] text-stone",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2",
							children: "Piece"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Price" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Live" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop/$slug",
								params: { slug: p.slug },
								className: "font-display text-lg",
								children: p.name
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "tabular-nums",
							children: formatPkr(p.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: published[p.slug] === false ? "Hidden" : "Live" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs uppercase tracking-[0.14em]",
							onClick: () => {
								setEdit(p);
								setOn(published[p.slug] !== false);
								setStockVal(p.defaultStock);
							},
							children: "Edit"
						}) })
					]
				}, p.slug)) })]
			}),
			edit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 max-w-xl space-y-3 rounded-2xl border border-border bg-card p-5",
				onSubmit: async (e) => {
					e.preventDefault();
					await saveProduct({ data: {
						product: edit,
						published: on,
						stock
					} });
					refresh();
					setEdit(null);
					reload();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl",
						children: edit.slug ? "Edit" : "New piece"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Slug",
						value: edit.slug,
						onChange: (e) => setEdit({
							...edit,
							slug: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Name",
						value: edit.name,
						onChange: (e) => setEdit({
							...edit,
							name: e.target.value
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Price PKR",
						type: "number",
						value: edit.price,
						onChange: (e) => setEdit({
							...edit,
							price: Number(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Stock",
						type: "number",
						value: stock,
						onChange: (e) => setStockVal(Number(e.target.value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: edit.collection,
						onChange: (e) => setEdit({
							...edit,
							collection: e.target.value
						}),
						className: "sitara-select",
						children: COLLECTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.slug,
							children: c.name
						}, c.slug))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: edit.category,
						onChange: (e) => setEdit({
							...edit,
							category: e.target.value
						}),
						className: "sitara-select",
						children: Object.entries(CATEGORY_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: v
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: edit.metal,
						onChange: (e) => setEdit({
							...edit,
							metal: e.target.value
						}),
						className: "sitara-select",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "gold",
								children: "Gold"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "silver",
								children: "Silver"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "plated",
								children: "Plated"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Image path /products/…",
						value: edit.images[0] ?? "",
						onChange: (e) => setEdit({
							...edit,
							images: [e.target.value]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: edit.description,
						onChange: (e) => setEdit({
							...edit,
							description: e.target.value
						}),
						className: "min-h-24 w-full rounded-lg border border-border bg-ivory p-3 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: on,
							onChange: (e) => setOn(e.target.checked)
						}), " Published"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: Boolean(edit.featured),
							onChange: (e) => setEdit({
								...edit,
								featured: e.target.checked
							})
						}), " Featured"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: Boolean(edit.newest),
							onChange: (e) => setEdit({
								...edit,
								newest: e.target.checked
							})
						}), " New arrival"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: Boolean(edit.bestSeller),
								onChange: (e) => setEdit({
									...edit,
									bestSeller: e.target.checked
								})
							}),
							" ",
							"Best seller"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Save"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setEdit(null),
							children: "Close"
						})]
					})
				]
			})
		]
	});
}
function Orders() {
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [items, setItems] = (0, import_react.useState)([]);
	function reload() {
		listAllOrders().then((d) => {
			setOrders(d.orders);
			setItems(d.items);
		}).catch(() => {});
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-8 space-y-3",
		children: [orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-stone",
			children: "No orders yet."
		}), orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "rounded-xl border border-border p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: o.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-stone",
						children: [
							o.guest_name,
							" · ",
							o.city,
							" · ",
							o.phone,
							" · ",
							formatPkr(o.total)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.14em] text-stone",
						children: [
							STATUS_LABEL[o.status] ?? o.status,
							" · ",
							STATUS_LABEL[o.payment_status ?? ""] ?? o.payment_status
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 text-sm",
						children: items.filter((it) => it.order_id === o.id).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							it.name,
							" × ",
							it.qty
						] }, it.name))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						(NEXT_STATUS[o.status] ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: async () => {
								await setOrderStatus({ data: {
									id: o.id,
									status: s
								} });
								reload();
							},
							children: STATUS_LABEL[s] ?? s
						}, s)),
						o.payment_status !== "paid" && o.payment_status !== "cod_pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: async () => {
								await confirmPayment({ data: {
									id: o.id,
									paid: true
								} });
								reload();
							},
							children: "Mark paid"
						}),
						o.payment_status === "cod_pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: async () => {
								await confirmPayment({ data: {
									id: o.id,
									paid: true
								} });
								reload();
							},
							children: "Cash collected"
						})
					]
				})]
			})
		}, o.id))]
	});
}
function Customers() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listCustomers().then(setRows).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-8 space-y-2 text-sm",
		children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-stone",
			children: "No profiles yet."
		}), rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-xl border border-border p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl",
				children: p.display_name || p.user_id
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-stone",
				children: [
					p.phone,
					" · ",
					p.city,
					" · ",
					p.coins,
					" coins · ",
					formatPkr(p.store_credit_pkr)
				]
			})]
		}, p.user_id))]
	});
}
function Reviews() {
	const [rows, setRows] = (0, import_react.useState)([]);
	function reload() {
		listReviewsAdmin().then(setRows).catch(() => {});
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-8 space-y-3",
		children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-stone",
			children: "No reviews."
		}), rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-xl border border-border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: r.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: r.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 text-xs uppercase tracking-[0.14em] text-stone",
					onClick: () => deleteReview({ data: { id: r.id } }).then(reload),
					children: "Remove"
				})
			]
		}, r.id))]
	});
}
function Coupons() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [code, setCode] = (0, import_react.useState)("");
	const [value, setValue] = (0, import_react.useState)(10);
	const [kind, setKind] = (0, import_react.useState)("percent");
	function reload() {
		listCoupons().then(setRows).catch(() => {});
	}
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2 text-sm",
			children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: c.code
					}),
					" · ",
					c.kind,
					" ",
					c.value,
					" · used ",
					c.uses,
					c.active ? "" : " · off"
				]
			}, c.code))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-6 max-w-md space-y-3",
			onSubmit: async (e) => {
				e.preventDefault();
				await saveCoupon({ data: {
					code,
					kind,
					value,
					min_subtotal: 0,
					active: true
				} });
				setCode("");
				reload();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "CODE",
					value: code,
					onChange: (e) => setCode(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: kind,
					onChange: (e) => setKind(e.target.value),
					className: "sitara-select",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "percent",
							children: "Percent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "fixed",
							children: "Fixed PKR"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "shipping",
							children: "Free shipping"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value,
					onChange: (e) => setValue(Number(e.target.value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save coupon"
				})
			]
		})]
	});
}
function Enquiries() {
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		listEnquiries().then(setRows).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-8 space-y-3",
		children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-stone",
			children: "No notes yet."
		}), rows.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-xl border border-border p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: e.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-stone",
					children: [
						e.email,
						" · ",
						e.phone
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: e.message
				})
			]
		}, e.id))]
	});
}
function Settings() {
	const { settings, refresh } = useStorefront();
	const [form, setForm] = (0, import_react.useState)(settings);
	(0, import_react.useEffect)(() => {
		setForm(settings);
	}, [settings]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-8 max-w-lg space-y-3",
		onSubmit: async (e) => {
			e.preventDefault();
			await saveSettings({ data: {
				cod_enabled: Boolean(form.cod_enabled),
				free_shipping_over: Number(form.free_shipping_over ?? 5e3),
				gold_24k_tola_pkr: Number(form.gold_24k_tola_pkr ?? 352e3),
				whatsapp_number: String(form.whatsapp_number ?? ""),
				bank_name: form.bank_name ?? "",
				bank_iban: form.bank_iban ?? "",
				bank_account_title: form.bank_account_title ?? "",
				raast_id: form.raast_id ?? "",
				jazzcash_merchant_id: form.jazzcash_merchant_id ?? "",
				easypaisa_store_id: form.easypaisa_store_id ?? "",
				card_public_key: form.card_public_key ?? "",
				hero_kicker: form.hero_kicker ?? "",
				hero_title: form.hero_title ?? "",
				hero_dek: form.hero_dek ?? "",
				gift_wrap_pkr: Number(form.gift_wrap_pkr ?? 650)
			} });
			refresh();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center justify-between rounded-xl border border-border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cash on delivery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: Boolean(form.cod_enabled),
					onChange: (e) => setForm({
						...form,
						cod_enabled: e.target.checked
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Free shipping over (PKR)",
				value: String(form.free_shipping_over ?? ""),
				onChange: (v) => setForm({
					...form,
					free_shipping_over: Number(v)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "WhatsApp",
				value: form.whatsapp_number ?? "",
				onChange: (v) => setForm({
					...form,
					whatsapp_number: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Bank name",
				value: form.bank_name ?? "",
				onChange: (v) => setForm({
					...form,
					bank_name: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "IBAN",
				value: form.bank_iban ?? "",
				onChange: (v) => setForm({
					...form,
					bank_iban: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Account title",
				value: form.bank_account_title ?? "",
				onChange: (v) => setForm({
					...form,
					bank_account_title: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Raast id",
				value: form.raast_id ?? "",
				onChange: (v) => setForm({
					...form,
					raast_id: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "JazzCash merchant id",
				value: form.jazzcash_merchant_id ?? "",
				onChange: (v) => setForm({
					...form,
					jazzcash_merchant_id: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Easypaisa store id",
				value: form.easypaisa_store_id ?? "",
				onChange: (v) => setForm({
					...form,
					easypaisa_store_id: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Card public key",
				value: form.card_public_key ?? "",
				onChange: (v) => setForm({
					...form,
					card_public_key: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-stone",
				children: "Leave wallet and card fields empty to keep them disabled. Filling them does not mark orders paid — the desk confirms."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Hero kicker",
				value: form.hero_kicker ?? "",
				onChange: (v) => setForm({
					...form,
					hero_kicker: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Hero title",
				value: form.hero_title ?? "",
				onChange: (v) => setForm({
					...form,
					hero_title: v
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				placeholder: "Hero dek",
				value: form.hero_dek ?? "",
				onChange: (e) => setForm({
					...form,
					hero_dek: e.target.value
				}),
				className: "min-h-24 w-full rounded-lg border border-border bg-card p-3 text-sm"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "Save settings"
			})
		]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-1",
			value,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
//#endregion
export { Atelier as component };
