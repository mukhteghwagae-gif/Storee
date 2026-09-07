import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, v as getRouteApi, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as METAL_LABEL, h as searchHaystack, i as GEMSTONES, n as COLLECTIONS, o as OCCASION_LABEL, t as CATEGORY_LABEL } from "./catalog-BkM9Pw9j.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { _ as useStorefront, p as matchesQuery } from "./router-Cj9UCdm1.mjs";
import { t as ProductCard } from "./product-card-C5FexRMX.mjs";
import { t as Breadcrumbs } from "./breadcrumbs-BN388ogx.mjs";
import { t as trackEvent } from "./analytics-BrWCqjct.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop.index-C6RXZdYh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var shopRoute = getRouteApi("/shop");
function Shop() {
	const search = shopRoute.useSearch();
	const navigate = useNavigate({ from: "/shop/" });
	const { products } = useStorefront();
	const metal = search.metal ?? "all";
	const category = search.category ?? "all";
	const occasion = search.occasion ?? "all";
	const collection = search.collection ?? "all";
	const sort = search.sort ?? "featured";
	const q = search.q ?? "";
	const [gem, setGem] = (0, import_react.useState)("all");
	const [maxPrice, setMaxPrice] = (0, import_react.useState)(2e6);
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	function patch(partial) {
		navigate({
			search: (prev) => {
				const next = {
					...prev,
					...partial
				};
				for (const key of Object.keys(next)) {
					const v = next[key];
					if (v === "all" || v === "" || v === void 0) delete next[key];
				}
				return next;
			},
			replace: true
		});
	}
	(0, import_react.useEffect)(() => {
		if (q) trackEvent("search", { q });
	}, [q]);
	const list = (0, import_react.useMemo)(() => {
		let rows = products.filter((p) => {
			if (q && !matchesQuery(searchHaystack(p), q)) return false;
			if (metal !== "all" && p.metal !== metal) return false;
			if (category !== "all" && p.category !== category) return false;
			if (occasion !== "all" && !p.occasion.includes(occasion)) return false;
			if (gem !== "all" && p.gemstone !== gem) return false;
			if (collection !== "all" && p.collection !== collection) return false;
			if (p.price > maxPrice) return false;
			return true;
		});
		rows = [...rows].sort((a, b) => {
			if (sort === "price-asc") return a.price - b.price;
			if (sort === "price-desc") return b.price - a.price;
			if (sort === "newest") return Number(b.newest) - Number(a.newest);
			if (sort === "best") return Number(b.bestSeller) - Number(a.bestSeller);
			return Number(b.featured) - Number(a.featured);
		});
		return rows;
	}, [
		products,
		metal,
		category,
		occasion,
		gem,
		collection,
		maxPrice,
		sort,
		q
	]);
	const maxLabel = maxPrice >= 2e6 ? "Any" : `Rs ${(maxPrice / 1e3).toFixed(0)}k`;
	const filters = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Collection",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: collection,
					onChange: (e) => patch({ collection: e.target.value }),
					className: "sitara-select",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All"
					}), COLLECTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.slug,
						children: c.name
					}, c.slug))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Metal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
					value: metal,
					onChange: (v) => patch({ metal: v }),
					options: [["all", "All"], ...Object.entries(METAL_LABEL)]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Category",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
					value: category,
					onChange: (v) => patch({ category: v }),
					options: [["all", "All"], ...Object.entries(CATEGORY_LABEL)]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Occasion",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
					value: occasion,
					onChange: (v) => patch({ occasion: v }),
					options: [["all", "All"], ...Object.entries(OCCASION_LABEL)]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Gemstone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: gem,
					onChange: (e) => setGem(e.target.value),
					className: "sitara-select",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All"
					}), GEMSTONES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: g,
						children: g
					}, g))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: `Up to ${maxLabel}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 5e3,
					max: 2e6,
					step: 5e3,
					value: maxPrice,
					onChange: (e) => setMaxPrice(Number(e.target.value)),
					className: "w-full accent-emerald"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{ label: "Shop" }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-[11px] uppercase tracking-[0.2em] text-stone",
				children: "The house"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl md:text-5xl",
					children: q ? `“${q}”` : occasion !== "all" ? OCCASION_LABEL[occasion] : "Shop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-lg border border-border px-3 text-sm md:hidden",
						onClick: () => setFiltersOpen(true),
						children: "Filters"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (e) => patch({ sort: e.target.value }),
						className: "h-11 rounded-lg border border-border bg-card px-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "featured",
								children: "Featured"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "newest",
								children: "Newest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "best",
								children: "Best selling"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price-asc",
								children: "Price: low to high"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price-desc",
								children: "Price: high to low"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-stone",
				children: [list.length, " pieces"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-10 md:grid-cols-[220px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden md:block",
					children: filters
				}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-16 text-center text-sm text-stone",
					children: "No pieces match those filters. Loosen a chip."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6",
					children: list.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						priority: i < 4
					}, p.slug))
				})]
			}),
			filtersOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-ink/40 md:hidden",
				onClick: () => setFiltersOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-auto rounded-t-2xl bg-ivory p-5",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Filters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFiltersOpen(false),
							className: "h-11 px-3 text-sm",
							children: "Done"
						})]
					}), filters]
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-[11px] uppercase tracking-[0.16em] text-stone",
		children: label
	}), children] });
}
function ChipRow({ value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: options.map(([v, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(v),
			className: cn("h-8 rounded-full px-3 text-xs capitalize", value === v ? "bg-emerald text-ivory" : "bg-ivory-deep text-ink"),
			children: label
		}, v))
	});
}
//#endregion
export { Shop as component };
