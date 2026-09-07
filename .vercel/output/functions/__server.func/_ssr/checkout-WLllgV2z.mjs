import { o as __toESM } from "../_runtime.mjs";
import { n as STATUS_LABEL } from "./order-BuQcDLgy.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import "./catalog-BkM9Pw9j.mjs";
import { c as placeSignedOrder, l as previewQuote, o as listMyAddresses, s as placeGuestOrder, t as cancelGuestOrder, u as previewSignedQuote } from "./commerce-BpEajYIO.mjs";
import { t as CITIES } from "./shipping-DOUYcwLY.mjs";
import { C as Button, _ as useStorefront, d as hydrateLines, f as useSitara, m as formatPkr, w as useCurrentUserState, y as getOrCreateProfile } from "./router-Cj9UCdm1.mjs";
import { t as Input } from "./input-BgwakZUo.mjs";
import { n as paymentOptions } from "./payments-B7YEvpME.mjs";
import { t as trackEvent } from "./analytics-BrWCqjct.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-WLllgV2z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkout() {
	const cart = useSitara((s) => s.cart);
	const clearCart = useSitara((s) => s.clearCart);
	const referralInput = useSitara((s) => s.referralInput);
	const setReferralInput = useSitara((s) => s.setReferralInput);
	const redeemCoins = useSitara((s) => s.redeemCoins);
	const setRedeemCoins = useSitara((s) => s.setRedeemCoins);
	const couponCode = useSitara((s) => s.couponCode);
	const setCouponCode = useSitara((s) => s.setCouponCode);
	const giftWrap = useSitara((s) => s.giftWrap);
	const setGiftWrap = useSitara((s) => s.setGiftWrap);
	const giftMessage = useSitara((s) => s.giftMessage);
	const setGiftMessage = useSitara((s) => s.setGiftMessage);
	const { productBySlug, settings, refresh } = useStorefront();
	const lines = hydrateLines(cart, productBySlug);
	const { user, isPending } = useCurrentUserState();
	const [city, setCity] = (0, import_react.useState)("Lahore");
	const [courier, setCourier] = (0, import_react.useState)("leopard");
	const [pay, setPay] = (0, import_react.useState)(settings.cod_enabled ? "cod" : "bank");
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [coins, setCoins] = (0, import_react.useState)(0);
	const [quote, setQuote] = (0, import_react.useState)(null);
	const [quoteError, setQuoteError] = (0, import_react.useState)(null);
	const [addresses, setAddresses] = (0, import_react.useState)([]);
	const methods = (0, import_react.useMemo)(() => paymentOptions(settings), [settings]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		getOrCreateProfile().then((p) => {
			if (p?.phone) setPhone(p.phone);
			if (p?.address_line) setAddress(p.address_line);
			if (p?.city && CITIES.includes(p.city)) setCity(p.city);
			if (p?.display_name) setName(p.display_name);
			setCoins(p?.coins ?? 0);
		}).catch(() => {});
		listMyAddresses().then(setAddresses).catch(() => {});
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (!methods.some((m) => m.id === pay && m.available)) {
			const first = methods.find((m) => m.available);
			if (first) setPay(first.id);
		}
	}, [methods, pay]);
	const payload = (0, import_react.useMemo)(() => ({
		items: lines.map(({ product, line }) => ({
			slug: product.slug,
			qty: line.qty,
			size: line.size
		})),
		payment_method: pay,
		city,
		address_line: address || "placeholder-address-line",
		phone: phone || "03000000000",
		courier,
		name: name || "Guest",
		coupon: couponCode || void 0,
		gift_wrap: giftWrap,
		gift_message: giftMessage || void 0,
		redeem_coins: user ? redeemCoins : 0,
		referral_code: referralInput || void 0
	}), [
		lines,
		pay,
		city,
		address,
		phone,
		courier,
		name,
		couponCode,
		giftWrap,
		giftMessage,
		redeemCoins,
		referralInput,
		user
	]);
	(0, import_react.useEffect)(() => {
		if (lines.length === 0) return;
		let cancelled = false;
		const t = window.setTimeout(() => {
			(user ? previewSignedQuote : previewQuote)({ data: payload }).then((q) => {
				if (cancelled) return;
				setQuote(q);
				setQuoteError(null);
			}).catch((err) => {
				if (cancelled) return;
				setQuote(null);
				setQuoteError(err instanceof Error ? err.message : "Could not quote");
			});
		}, 280);
		return () => {
			cancelled = true;
			window.clearTimeout(t);
		};
	}, [payload, lines.length]);
	(0, import_react.useEffect)(() => {
		if (lines.length) trackEvent("checkout", { items: lines.length });
	}, [lines.length]);
	if (lines.length === 0 && !done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Your bag is empty"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				children: "Shop"
			})
		})]
	});
	if (done) {
		const wa = `https://wa.me/${settings.whatsapp_number || "923001112223"}?text=${encodeURIComponent(`Salaam Sitara, order ${done.id} totalling ${formatPkr(done.total)}. Token ${done.tracking_token}`)}`;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-lg px-4 py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Order received"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl",
					children: done.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-ink-soft",
					children: [
						formatPkr(done.total),
						" · ",
						STATUS_LABEL[done.payment_status] ?? done.payment_status
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-stone",
					children: [
						"Tracking token ",
						done.tracking_token,
						". Nothing has been marked as paid."
					]
				}),
				done.cancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-emerald",
					children: "This order was cancelled. Stock is back on the tray."
				}),
				done.bank?.iban && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 rounded-xl border border-border bg-card p-4 text-left text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.16em] text-stone",
							children: "Transfer to"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: done.bank.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: done.bank.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono",
							children: done.bank.iban
						}),
						done.bank.raast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Raast · ", done.bank.raast] })
					]
				}),
				done.merchant && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm text-ink-soft",
					children: [
						"Pay the atelier merchant ",
						done.merchant,
						". The desk will confirm before packing."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-8",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: wa,
						target: "_blank",
						rel: "noreferrer",
						children: "Send on WhatsApp"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/track",
						search: { id: done.id },
						className: "underline",
						children: "Track parcel"
					}), user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						className: "underline",
						children: "Your orders"
					})]
				}),
				!user && !done.cancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-6 text-xs uppercase tracking-[0.14em] text-stone underline",
					onClick: async () => {
						try {
							await cancelGuestOrder({ data: {
								id: done.id,
								phone
							} });
							setDone({
								...done,
								cancelled: true
							});
						} catch (err) {
							setError(err instanceof Error ? err.message : "Could not cancel");
						}
					},
					children: "Cancel this pending order"
				})
			]
		});
	}
	async function onSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const body = {
				items: lines.map(({ product, line }) => ({
					slug: product.slug,
					qty: line.qty,
					size: line.size
				})),
				payment_method: pay,
				city,
				address_line: address,
				phone,
				courier,
				name,
				coupon: couponCode || void 0,
				gift_wrap: giftWrap,
				gift_message: giftMessage || void 0,
				redeem_coins: user ? redeemCoins : 0,
				referral_code: referralInput || void 0
			};
			const res = user ? await placeSignedOrder({ data: body }) : await placeGuestOrder({ data: body });
			trackEvent("purchase", {
				id: res.id,
				total: res.total,
				method: pay
			});
			clearCart();
			refresh();
			setDone({
				id: res.id,
				total: res.total,
				payment_status: res.payment_status,
				tracking_token: res.tracking_token,
				bank: res.bank,
				merchant: res.merchant ?? null
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not place order");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: "Checkout"
				}),
				!isPending && !user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "rounded-lg bg-ivory-deep px-3 py-2 text-sm",
					children: [
						"Guest checkout is saved on the atelier desk.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "underline",
							children: "Sign in"
						}),
						" ",
						"to earn coins and keep addresses."
					]
				}),
				addresses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.16em] text-stone",
						children: "Saved addresses"
					}), addresses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "w-full rounded-lg border border-border px-3 py-3 text-left text-sm",
						onClick: () => {
							setAddress(a.address_line);
							if (a.city && CITIES.includes(a.city)) setCity(a.city);
							if (a.phone) setPhone(a.phone);
							if (a.name) setName(a.name);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: a.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-stone",
							children: [
								a.address_line,
								", ",
								a.city
							]
						})]
					}, a.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					placeholder: "Full name",
					value: name,
					onChange: (e) => setName(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					placeholder: "03XXXXXXXXX",
					value: phone,
					onChange: (e) => setPhone(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					placeholder: "House, street, mohalla",
					value: address,
					onChange: (e) => setAddress(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: city,
					onChange: (e) => setCity(e.target.value),
					className: "sitara-select",
					children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [
						"leopard",
						"tcs",
						"call"
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCourier(c),
						className: `h-10 rounded-lg border px-3 text-xs uppercase tracking-[0.12em] ${courier === c ? "border-ink bg-ink text-ivory" : "border-border"}`,
						children: c
					}, c))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.16em] text-stone",
					children: "Pay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2",
					children: methods.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `rounded-lg border px-3 py-3 ${pay === p.id ? "border-ink" : "border-border"} ${!p.available ? "opacity-50" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "pay",
									disabled: !p.available,
									checked: pay === p.id,
									onChange: () => setPay(p.id)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.label }),
								!p.configured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto text-[10px] uppercase tracking-[0.14em] text-stone",
									children: "Not connected"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block pl-7 text-xs text-stone",
							children: p.hint
						})]
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-3 rounded-lg border border-border px-3 py-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: giftWrap,
							onChange: (e) => setGiftWrap(e.target.checked)
						}),
						"Cedar gift wrap · ",
						formatPkr(settings.gift_wrap_pkr ?? 650)
					]
				}),
				giftWrap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Gift message (optional)",
					value: giftMessage,
					onChange: (e) => setGiftMessage(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Coupon",
					value: couponCode,
					onChange: (e) => setCouponCode(e.target.value.toUpperCase())
				}),
				user && coins > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: [
						"Redeem gold coins (",
						coins,
						" available)",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: coins,
							value: redeemCoins,
							onChange: (e) => setRedeemCoins(Number(e.target.value)),
							className: "mt-2 w-full accent-emerald"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Referral code (SITARA-…)",
					value: referralInput,
					onChange: (e) => setReferralInput(e.target.value.toUpperCase())
				}),
				(error || quoteError) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: error || quoteError
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					size: "lg",
					disabled: busy || !quote,
					children: busy ? "Placing…" : `Place order · ${formatPkr(quote?.total ?? 0)}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-stone",
					children: "Totals are calculated on the atelier desk. Online wallets stay unpaid until the merchant account is connected and the desk confirms."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit rounded-2xl border border-border bg-card p-5",
			children: [
				lines.map(({ product, line }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						product.name,
						" × ",
						line.qty
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatPkr(product.price * line.qty)
					})]
				}, `${product.slug}-${line.size ?? ""}`)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1 border-t border-border pt-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Subtotal",
							value: formatPkr(quote?.subtotal ?? 0)
						}),
						(quote?.stackDiscount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Stack courtesy",
							value: `−${formatPkr(quote.stackDiscount)}`
						}),
						(quote?.couponDiscount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: quote?.couponCode ?? "Coupon",
							value: `−${formatPkr(quote.couponDiscount)}`
						}),
						(quote?.coinDiscount ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Coins",
							value: `−${formatPkr(quote.coinDiscount)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Shipping",
							value: quote?.shipping === 0 ? "Free" : formatPkr(quote?.shipping ?? 0)
						}),
						(quote?.giftWrap ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Gift wrap",
							value: formatPkr(quote.giftWrap)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex justify-between border-t border-border pt-3 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatPkr(quote?.total ?? 0)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-[11px] text-stone",
					children: [quote ? `${quote.shippingLabel} · ${quote.days} days` : "Quoting…", " · GST shown when FBR requires it."]
				})
			]
		})]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-stone",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { Checkout as component };
