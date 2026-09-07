import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as COLLECTIONS } from "./catalog-BkM9Pw9j.mjs";
import { n as estimateShipping } from "./shipping-DOUYcwLY.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as Sparkles, b as Heart, c as Share2, d as ScanLine, f as RotateCcw, g as MessageCircle, r as Truck, s as ShieldCheck, t as X } from "../_libs/lucide-react.mjs";
import { C as Button, _ as useStorefront, f as useSitara, g as useStock, m as formatPkr, n as Route$1, v as addReview, w as useCurrentUserState, x as toggleStockAlert } from "./router-Cj9UCdm1.mjs";
import { n as PK_SIZES, t as BANGLE_SIZES } from "./sizes-36DjQiLN.mjs";
import { g as tryOnZoneFor } from "./intelligence-wVEiNvGR.mjs";
import { t as ProductCard } from "./product-card-C5FexRMX.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
import { i as personalizedFromHistory, o as similarProducts, t as frequentlyTogether } from "./recommendations-DWKZp0-I.mjs";
import { t as trackEvent } from "./analytics-BrWCqjct.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop._slug-C_FGIex4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Pdp() {
	const { slug } = Route$1.useParams();
	const { productBySlug } = useStorefront();
	const product = productBySlug[slug];
	const view = useSitara((s) => s.view);
	(0, import_react.useEffect)(() => {
		if (product) {
			view(product.slug);
			trackEvent("product_view", { slug: product.slug });
		}
	}, [product, view]);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "This piece has left the tray"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				children: "Back to shop"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdpInner, {}, product.slug);
}
function PdpInner() {
	const { slug } = Route$1.useParams();
	const navigate = useNavigate();
	const { productBySlug, products, reviews, refresh, settings } = useStorefront();
	const product = productBySlug[slug];
	const stock = useStock(product.slug);
	const addToCart = useSitara((s) => s.addToCart);
	const toggleWish = useSitara((s) => s.toggleWish);
	const wished = useSitara((s) => s.wishlist.includes(product.slug));
	const recently = useSitara((s) => s.recentlyViewed);
	const [img, setImg] = (0, import_react.useState)(0);
	const [zoom, setZoom] = (0, import_react.useState)(false);
	const [size, setSize] = (0, import_react.useState)(product.sizeType === "ring" ? "13" : product.sizeType === "bangle" ? "2.6" : void 0);
	const [added, setAdded] = (0, import_react.useState)(false);
	const [guide, setGuide] = (0, import_react.useState)(false);
	const { user } = useCurrentUserState();
	const mine = reviews.filter((r) => r.product_id === product.slug);
	const look = product.completeTheLook.map((s) => productBySlug[s]).filter(Boolean);
	const fbt = frequentlyTogether(product, products, 2);
	const similar = similarProducts(product, products, 4);
	const personal = personalizedFromHistory(recently, products, 4);
	const collectionName = COLLECTIONS.find((c) => c.slug === product.collection)?.name ?? product.collection.replace(/-/g, " ");
	const rating = mine.length > 0 ? mine.reduce((s, r) => s + r.rating, 0) / mine.length : null;
	const ship = estimateShipping({
		city: "Lahore",
		subtotal: product.price,
		freeOver: settings.free_shipping_over
	});
	const wa = `https://wa.me/${settings.whatsapp_number || "923001112223"}?text=${encodeURIComponent(`Salaam Sitara, I have a question about ${product.name}.`)}`;
	const jsonLd = (0, import_react.useMemo)(() => {
		const data = {
			"@context": "https://schema.org",
			"@type": "Product",
			name: product.name,
			image: product.images,
			description: product.description,
			sku: product.slug,
			brand: {
				"@type": "Brand",
				name: "Sitara"
			},
			offers: {
				"@type": "Offer",
				priceCurrency: "PKR",
				price: product.price,
				availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
			}
		};
		if (rating && mine.length) data.aggregateRating = {
			"@type": "AggregateRating",
			ratingValue: rating.toFixed(1),
			reviewCount: mine.length
		};
		return JSON.stringify(data);
	}, [
		product,
		stock,
		rating,
		mine.length
	]);
	function add() {
		addToCart(product.slug, 1, size);
		setAdded(true);
		trackEvent("add_to_cart", { slug: product.slug });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10 pb-28 md:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: jsonLd }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [
				{
					to: "/shop",
					label: "Shop"
				},
				{
					to: `/collections/${product.collection}`,
					label: collectionName
				},
				{ label: product.name }
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-10 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "relative overflow-hidden rounded-2xl bg-ivory-deep",
						onClick: () => setZoom(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.images[img] ?? product.images[0],
							alt: product.name,
							className: "aspect-[3/4] w-full object-cover"
						})
					}),
					product.images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mt-3 flex h-11 items-center gap-2 text-xs uppercase tracking-[0.14em]",
						onClick: () => setImg((i) => (i + 1) % product.images.length),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Turn the piece"]
					}),
					product.images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2",
						children: product.images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setImg(i),
							className: cn("size-16 overflow-hidden rounded-md border", i === img ? "border-ink" : "border-transparent"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: "",
								className: "h-full w-full object-cover"
							})
						}, src))
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl md:text-5xl",
						children: product.name
					}),
					product.urdu && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-naskh text-xl text-stone",
						lang: "ur",
						children: product.urdu
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-lg tabular-nums text-ink",
						children: formatPkr(product.price)
					}),
					product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-stone line-through tabular-nums",
						children: formatPkr(product.compareAt)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-stone",
						children: [
							product.karat ?? product.metal,
							product.weightG ? ` · ${product.weightG} g` : "",
							product.hallmarked ? " · Hallmarked" : "",
							product.gemstone ? ` · ${product.gemstone}` : ""
						]
					}),
					product.makingPkr > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-stone",
						children: [
							"Making ",
							formatPkr(product.makingPkr),
							" — already in the price, not added at the counter."
						]
					}),
					rating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-stone",
						children: [
							rating.toFixed(1),
							" · ",
							mine.length,
							" review",
							mine.length === 1 ? "" : "s"
						]
					}),
					stock > 0 && stock <= 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-emerald",
						children: [
							"Only ",
							stock,
							" left on the tray."
						]
					}),
					stock <= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-stone",
						children: "Currently at the bench. Join the waitlist."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 leading-relaxed text-ink-soft",
						children: product.description
					}),
					product.sizeType === "ring" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] uppercase tracking-[0.16em] text-stone",
								children: "Pakistani size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs underline",
								onClick: () => setGuide(true),
								children: "Size guide"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: PK_SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSize(String(s.pk)),
								className: cn("size-11 rounded-md border text-sm", size === String(s.pk) ? "border-ink bg-ink text-ivory" : "border-border"),
								children: s.pk
							}, s.pk))
						})]
					}),
					product.sizeType === "bangle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.16em] text-stone",
							children: "Inner diameter"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: BANGLE_SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSize(s.id),
								className: cn("h-10 rounded-md border px-3 text-sm", size === s.id ? "border-ink bg-ink text-ivory" : "border-border"),
								children: s.inches
							}, s.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [
							stock > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "flex-1",
								onClick: add,
								children: added ? "Added to bag" : "Add to bag"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "gold",
								onClick: () => {
									add();
									navigate({ to: "/checkout" });
								},
								children: "Buy now"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "flex-1",
								variant: "outline",
								onClick: () => {
									if (!user) {
										window.location.assign("/login");
										return;
									}
									toggleStockAlert({ data: { product_id: product.slug } });
								},
								children: "Notify when back"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "outline",
								"aria-label": "Save",
								onClick: () => {
									toggleWish(product.slug);
									trackEvent("wishlist", { slug: product.slug });
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", wished && "fill-current text-emerald") })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "outline",
								"aria-label": "Share",
								onClick: () => {
									const url = window.location.href;
									if (navigator.share) navigator.share({
										title: product.name,
										url
									});
									else navigator.clipboard.writeText(url);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-3",
						children: [tryOnZoneFor(product) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/try-on",
								search: { piece: product.slug },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-4" }), "Virtual try-on"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: wa,
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " WhatsApp enquiry"]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-8 space-y-3 text-sm text-ink-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 shrink-0 text-emerald" }), product.hallmarked ? "Certified 22k / 925 hallmark" : "Atelier-finished fashion metal"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-4 shrink-0 text-emerald" }),
									"Lahore ",
									ship.days,
									" days · rest of Pakistan 3–5 · complimentary over ",
									formatPkr(settings.free_shipping_over)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 shrink-0 text-emerald" }), product.antiTarnish ? "Anti-tarnish finish" : "Silver will oxidise in the recesses — that is the work"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 list-disc space-y-1 pl-5 text-sm text-ink-soft",
						children: product.details.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: d }, d))
					})
				] })]
			}),
			fbt.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Frequently together"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3",
					children: fbt.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			}),
			look.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Complete the look"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3",
					children: look.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, {
				slug: product.slug,
				reviews: mine,
				onPosted: refresh
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "You may also like"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4",
					children: similar.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			}),
			personal.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: "Recently in mind"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4",
					children: personal.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				})]
			}),
			guide && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4",
				onClick: () => setGuide(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[80dvh] w-full max-w-lg overflow-auto rounded-2xl bg-ivory p-6",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl",
							children: "Ring sizes · PK / UK / US"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "mt-4 w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-[11px] uppercase tracking-[0.14em] text-stone",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2",
										children: "PK"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "UK" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "US" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "mm" })
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: PK_SIZES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: s.pk
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.uk }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.us }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "tabular-nums",
										children: s.mm.toFixed(1)
									})
								]
							}, s.pk)) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/size-guide",
								children: "Full guide"
							})
						})
					]
				})
			}),
			zoom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 bg-ink/90 p-4",
				onClick: () => setZoom(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute right-4 top-4 grid size-11 place-items-center text-ivory",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.images[img],
					alt: product.name,
					className: "mx-auto h-full max-h-[90dvh] object-contain"
				})]
			}),
			stock > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-14 z-30 border-t border-border bg-ivory/95 px-4 py-3 md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatPkr(product.price)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: add,
						children: added ? "Added" : "Add to bag"
					})]
				})
			})
		]
	});
}
function Reviews({ slug, reviews, onPosted }) {
	const { user, isPending } = useCurrentUserState();
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [rating, setRating] = (0, import_react.useState)(5);
	const [photo, setPhoto] = (0, import_react.useState)();
	const [msg, setMsg] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-16 border-t border-border pt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: "Reviews"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 md:grid-cols-2",
				children: [reviews.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-stone",
					children: "No collector reviews yet. Be the first after delivery."
				}), reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.14em] text-gold-deep",
							children: "●".repeat(r.rating)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-xl",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-ink-soft",
							children: r.body
						}),
						r.photo_data_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: r.photo_data_url,
							alt: "",
							className: "mt-3 max-h-48 rounded-md object-cover"
						})
					]
				}, r.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl",
					children: "Write a review"
				}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-24 animate-pulse rounded-xl bg-ivory-deep" }) : !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-stone",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "underline",
							children: "Sign in"
						}),
						" ",
						"after a delivered order to review — you earn 25 gold coins."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 space-y-3",
					onSubmit: async (e) => {
						e.preventDefault();
						setMsg(null);
						try {
							await addReview({ data: {
								product_id: slug,
								rating,
								title,
								body,
								photo_data_url: photo
							} });
							setTitle("");
							setBody("");
							setPhoto(void 0);
							setMsg("Thank you. Coins have been added.");
							trackEvent("review", { slug });
							onPosted();
						} catch (err) {
							setMsg(err instanceof Error ? err.message : "Could not post");
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setRating(n),
								className: n <= rating ? "text-gold-deep" : "text-border",
								children: "●"
							}, n))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Title",
							className: "h-11 w-full rounded-lg border border-border bg-card px-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							value: body,
							onChange: (e) => setBody(e.target.value),
							placeholder: "How did it wear?",
							className: "min-h-28 w-full rounded-lg border border-border bg-card p-3 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (!f) return;
								const reader = new FileReader();
								reader.onload = () => setPhoto(String(reader.result));
								reader.readAsDataURL(f);
							}
						}),
						msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: msg
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Post review"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Pdp as component };
