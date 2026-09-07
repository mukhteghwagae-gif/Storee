import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as COLLECTIONS } from "./catalog-BkM9Pw9j.mjs";
import { T as ArrowRight } from "../_libs/lucide-react.mjs";
import { C as Button, _ as useStorefront, c as NewsletterForm, m as formatPkr } from "./router-Cj9UCdm1.mjs";
import { t as ProductCard } from "./product-card-C5FexRMX.mjs";
import { t as frequentlyTogether } from "./recommendations-DWKZp0-I.mjs";
import { t as ARTICLES } from "./journal-BHL4o27Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CgbBakqj.js
var import_jsx_runtime = require_jsx_runtime();
var ORG_LD = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "JewelryStore",
	name: "Sitara",
	url: "/",
	description: "Lahore house of hallmarked 22k gold, kundan, and daily pieces.",
	areaServed: "PK",
	currenciesAccepted: "PKR",
	paymentAccepted: "Cash on Delivery, Bank Transfer"
});
function Home() {
	const { products, reviews, settings } = useStorefront();
	const featured = products.filter((p) => p.featured);
	const newest = products.filter((p) => p.newest).slice(0, 4);
	const best = products.filter((p) => p.bestSeller).slice(0, 4);
	const lookHero = products.find((p) => p.completeTheLook.length >= 2) ?? products[0];
	const look = lookHero ? frequentlyTogether(lookHero, products, 3) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: ORG_LD }
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative min-h-[88dvh] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/editorial/hero.jpg",
					alt: "Sitara gold on emerald silk",
					className: "absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-ink/20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex min-h-[88dvh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32 text-ivory",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sitara-rise text-[11px] uppercase tracking-[0.32em]",
							children: settings.hero_kicker || "Lahore · Est. the bench"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "sitara-rise mt-4 max-w-xl font-display text-5xl leading-[0.95] md:text-7xl",
							style: { animationDelay: "80ms" },
							children: settings.hero_title || "Starlight, wrought in gold."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sitara-rise mt-5 max-w-md text-base text-ivory/85 md:text-lg",
							style: { animationDelay: "140ms" },
							children: settings.hero_dek || "Hallmarked 22k, kundan that sits, and the daily pieces Pakistani women actually wear. Cash on delivery. A seven-day return."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sitara-rise mt-8 flex flex-wrap gap-3",
							style: { animationDelay: "200ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "gold",
								size: "lg",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop",
									children: "Shop the house"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								className: "border-ivory/40 text-ivory hover:bg-ivory/10",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/bridal",
									children: "Bridal couture"
								})
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3",
			children: [
				["Certified 22k", "Every gold piece over 2 g leaves hallmarked."],
				["Easy 7-day returns", "Unworn, original box, no theatre."],
				["Pay as you live", "Cash on delivery across Pakistan. Wallets when connected."]
			].map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-gold-deep",
					children: t
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-ink-soft",
					children: d
				})]
			}, t))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Shop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "By category"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						[
							"necklace",
							"Necklaces",
							"/products/thread-chain.jpg"
						],
						[
							"earrings",
							"Earrings",
							"/products/lahore-jhumkas.jpg"
						],
						[
							"ring",
							"Rings",
							"/products/dawn-stack.jpg"
						],
						[
							"bangle",
							"Bangles",
							"/products/whisper-bangle.jpg"
						],
						[
							"bracelet",
							"Bracelets",
							"/products/constellation.jpg"
						],
						[
							"anklet",
							"Anklets",
							"/products/payal-stars.jpg"
						],
						[
							"tikka",
							"Tikka",
							"/products/sitara-tikka.jpg"
						]
					].map(([slug, label, src]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/category/$slug",
						params: { slug },
						className: "group relative overflow-hidden rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: "",
							className: "aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-x-0 bottom-0 bg-ink/50 px-3 py-3 font-display text-xl text-ivory",
							children: label
						})]
					}, slug))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Collections"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "A house in six rooms"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/collections",
					className: "items-center gap-1 text-sm flex",
					children: ["All rooms ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex gap-4 overflow-x-auto sitara-hide-scrollbar pb-2 md:grid md:grid-cols-3 md:overflow-visible",
				children: COLLECTIONS.map((c, i) => {
					const img = i === 0 ? "/editorial/bridal.jpg" : i === 1 ? "/editorial/everyday.jpg" : i === 2 ? "/editorial/lookbook.jpg" : i === 3 ? "/products/emerald-teardrop.jpg" : i === 4 ? "/products/moonlight-choker.jpg" : "/editorial/hand-stack.jpg";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/collections/$slug",
						params: { slug: c.slug },
						className: "relative min-w-[78%] overflow-hidden rounded-2xl md:min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img,
								alt: "",
								className: "aspect-[4/5] w-full object-cover md:aspect-[5/4]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute bottom-4 left-4 right-4 text-ivory",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-2xl",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-ivory/80",
									children: c.blurb
								})]
							})
						]
					}, c.slug);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "The tray"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "Pieces we stand behind"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/bestsellers",
					className: "text-sm",
					children: "Best sellers"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6",
				children: featured.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product: p,
					priority: i < 2
				}, p.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Just in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "New arrivals"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/arrivals",
					className: "text-sm",
					children: "All new"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-4 md:grid-cols-4",
				children: newest.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			})]
		}),
		best.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Most worn"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "Best sellers"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/bestsellers",
					className: "text-sm",
					children: "All best sellers"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-4 md:grid-cols-4",
				children: best.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Occasion"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "Shop the hour"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						{
							to: "/bridal",
							label: "Bridal",
							src: "/editorial/bridal.jpg",
							search: void 0
						},
						{
							to: "/shop",
							label: "Party",
							src: "/products/emerald-teardrop.jpg",
							search: { occasion: "party" }
						},
						{
							to: "/shop",
							label: "Office",
							src: "/editorial/lookbook.jpg",
							search: { occasion: "office" }
						},
						{
							to: "/shop",
							label: "Everyday",
							src: "/editorial/everyday.jpg",
							search: { occasion: "everyday" }
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						search: item.search,
						className: "relative overflow-hidden rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.src,
							alt: "",
							className: "aspect-[4/5] w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-x-0 bottom-0 bg-ink/50 px-3 py-3 font-display text-xl text-ivory",
							children: item.label
						})]
					}, item.label))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Style"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "Find your sentence"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/quiz",
								children: "Style quiz"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/match",
								children: "Outfit matcher"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/finder",
								children: "Gift finder"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/stack",
								children: "Stack builder"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/try-on",
								children: "Atelier Mirror"
							})
						})
					]
				})
			]
		}),
		lookHero && look.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Complete the look"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-1 font-display text-4xl",
					children: [lookHero.name, ", dressed"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid grid-cols-2 gap-4 md:grid-cols-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: lookHero }), look.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative mt-8 overflow-hidden",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/55" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex min-h-[26rem] max-w-6xl flex-col justify-end px-4 py-16 text-ivory",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.22em]",
							children: "The bench"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 max-w-lg font-display text-4xl md:text-5xl",
							children: "Gold is not poured. It is chased."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "gold",
							className: "mt-6 w-fit",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/craft",
								children: "Our craft"
							})
						})
					]
				})
			]
		}),
		reviews.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "From collectors"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "Worn, then written"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-4 md:grid-cols-3",
					children: reviews.slice(0, 3).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.14em] text-gold-deep",
								children: "●".repeat(r.rating)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-display text-xl",
								children: r.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-ink-soft",
								children: r.body
							})
						]
					}, r.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Styled by you"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "Photographs after delivery"
				}),
				reviews.filter((r) => r.photo_data_url).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-lg text-sm text-ink-soft",
					children: "When a collector sends a photograph with a review, it lives here. We do not stage customer posts."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: reviews.filter((r) => r.photo_data_url).slice(0, 8).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "overflow-hidden rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: r.photo_data_url ?? "",
							alt: r.title,
							className: "aspect-square w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-2 text-sm text-stone",
							children: r.title
						})]
					}, r.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/editorial/hand-stack.jpg",
				alt: "Stacked gold rings",
				className: "rounded-2xl object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Build your own"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl",
					children: "A stack is a sentence."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-ink-soft leading-relaxed",
					children: "Choose three rings or bangles, see them on a hand, add the set at ten percent less. The atelier will not sell you four textures unless you insist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stack",
						children: "Open the configurator"
					})
				})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-ivory-deep py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.2em] text-stone",
						children: "The Journal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-4xl",
						children: "Style, care, the bench"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/journal",
						className: "text-sm",
						children: "All essays"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-6 md:grid-cols-3",
					children: ARTICLES.slice(0, 3).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/journal/$slug",
						params: { slug: a.slug },
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: a.image,
								alt: "",
								className: "aspect-[16/10] w-full rounded-xl object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[11px] uppercase tracking-[0.16em] text-stone",
								children: a.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 font-display text-2xl leading-tight",
								children: a.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-ink-soft",
								children: a.dek
							})
						]
					}, a.slug))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Lookbook"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-4xl",
					children: "Styled in the house"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/lookbook",
					className: "text-sm",
					children: "Full lookbook"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-2 md:grid-cols-4",
				children: [
					"/editorial/lookbook.jpg",
					"/editorial/bridal.jpg",
					"/products/lahore-jhumkas.jpg",
					"/editorial/everyday.jpg",
					"/products/dawn-stack.jpg",
					"/editorial/hand-stack.jpg",
					"/products/pearl-luna.jpg",
					"/products/gold-hoops.jpg"
				].map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "Sitara lookbook",
					className: "aspect-square w-full object-cover"
				}, src))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border-t border-border px-4 py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "The list"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl",
					children: "First look at bridal edits"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-3 max-w-md text-sm text-ink-soft",
					children: "A code, occasionally. No mail is sent until the desk connects a provider."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-6 max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterForm, {})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "border-t border-border px-4 py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Refer a friend"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-4xl",
					children: "She buys. You receive Rs 500."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-3 max-w-md text-sm text-ink-soft",
					children: "Share your Sitara code. When she completes her first order, store credit lands in your account."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 font-display text-2xl text-emerald",
					children: [formatPkr(500), " credit"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						children: "Open your code"
					})
				})
			]
		})
	] });
}
//#endregion
export { Home as component };
