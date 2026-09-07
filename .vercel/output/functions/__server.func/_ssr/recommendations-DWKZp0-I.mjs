import { s as PRODUCTS } from "./catalog-BkM9Pw9j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recommendations-DWKZp0-I.js
function similarProducts(product, catalog = PRODUCTS, limit = 4) {
	return catalog.filter((p) => p.slug !== product.slug).map((p) => {
		let score = 0;
		if (p.category === product.category) score += 4;
		if (p.metal === product.metal) score += 2;
		if (p.collection === product.collection) score += 2;
		if (p.gemstone && p.gemstone === product.gemstone) score += 2;
		if (p.occasion.some((o) => product.occasion.includes(o))) score += 1;
		return {
			p,
			score
		};
	}).sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.p);
}
function frequentlyTogether(product, catalog = PRODUCTS, limit = 3) {
	const bySlug = Object.fromEntries(catalog.map((p) => [p.slug, p]));
	const fromLook = product.completeTheLook.map((s) => bySlug[s]).filter(Boolean);
	if (fromLook.length >= limit) return fromLook.slice(0, limit);
	const extra = similarProducts(product, catalog, 6).filter((p) => !fromLook.some((x) => x.slug === p.slug));
	return [...fromLook, ...extra].slice(0, limit);
}
function personalizedFromHistory(viewedSlugs, catalog = PRODUCTS, limit = 4) {
	const bySlug = Object.fromEntries(catalog.map((p) => [p.slug, p]));
	const viewed = viewedSlugs.map((s) => bySlug[s]).filter(Boolean);
	if (viewed.length === 0) return catalog.filter((p) => p.featured).slice(0, limit);
	const cats = /* @__PURE__ */ new Map();
	const metals = /* @__PURE__ */ new Map();
	for (const p of viewed) {
		cats.set(p.category, (cats.get(p.category) ?? 0) + 1);
		metals.set(p.metal, (metals.get(p.metal) ?? 0) + 1);
	}
	return catalog.filter((p) => !viewedSlugs.includes(p.slug)).map((p) => ({
		p,
		score: (cats.get(p.category) ?? 0) * 3 + (metals.get(p.metal) ?? 0) * 2 + (p.featured ? 1 : 0)
	})).sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.p);
}
function giftFind(a, catalog = PRODUCTS) {
	const max = a.budget === "under20" ? 2e4 : a.budget === "under80" ? 8e4 : a.budget === "under3l" ? 3e5 : Infinity;
	return catalog.filter((p) => p.price <= max).filter((p) => a.metal === "any" ? true : p.metal === a.metal || a.metal === "gold" && Boolean(p.karat)).filter((p) => {
		if (a.wearer === "bride" || a.occasion === "bridal") return p.occasion.includes("bridal");
		return p.occasion.includes(a.occasion);
	}).map((p) => {
		let score = Number(p.bestSeller) * 2;
		if (a.wearer === "mother") {
			if (p.category === "bangle" || p.category === "necklace") score += 3;
			if (p.metal === "gold") score += 2;
			if (p.weightG >= 6) score += 1;
		} else if (a.wearer === "sister") {
			if (p.category === "earrings" || p.category === "ring") score += 3;
			if (p.occasion.includes("everyday") || p.occasion.includes("party")) score += 1;
		} else if (a.wearer === "self") {
			if (p.occasion.includes("everyday") || p.occasion.includes("office")) score += 2;
		}
		return {
			p,
			score
		};
	}).sort((x, y) => y.score - x.score || x.p.price - y.p.price).slice(0, 8).map((x) => x.p);
}
function quizResult(a, catalog = PRODUCTS) {
	let title = "Everyday Gold";
	let dek = "A chain, studs, a knife-edge ring. The three-piece rule.";
	if (a.voice === "heirloom" || a.day === "events") {
		title = "Bridal Couture";
		dek = "Closed chokers, a tikka, kangan that will be photographed.";
	} else if (a.metal === "white") {
		title = "Silver & Stones";
		dek = "Moonlight metal. Light on the day, loud enough at night.";
	} else if (a.day === "office") {
		title = "The Office Edit";
		dek = "Minimal lines that read as composure.";
	} else if (a.metal === "rose" || a.voice === "quiet") {
		title = "Stack & Layer";
		dek = "Build a language of rings and chains.";
	}
	const wanted = title === "Bridal Couture" ? "bridal-couture" : title === "Silver & Stones" ? "silver-stones" : title === "The Office Edit" ? "office-edit" : title === "Stack & Layer" ? "stack-layer" : "everyday-gold";
	const slugs = catalog.filter((p) => p.collection === wanted).filter((p) => a.budget === "daily" ? p.price < 15e4 : true).slice(0, 4).map((p) => p.slug);
	return {
		title,
		dek,
		slugs
	};
}
function matchLook(a, catalog = PRODUCTS) {
	const metal = a.palette === "cool" ? "silver" : a.palette === "blush" ? "plated" : "gold";
	const prefer = a.neckline === "high" ? [
		"earrings",
		"ring",
		"bangle"
	] : a.neckline === "open" ? ["necklace", "earrings"] : [
		"ring",
		"bracelet",
		"bangle"
	];
	return catalog.filter((p) => p.occasion.includes(a.occasion)).filter((p) => p.metal === metal || metal === "gold" && p.metal === "gold").sort((x, y) => {
		const ix = prefer.indexOf(x.category);
		const iy = prefer.indexOf(y.category);
		return (ix === -1 ? 9 : ix) - (iy === -1 ? 9 : iy);
	}).slice(0, 6);
}
//#endregion
export { quizResult as a, personalizedFromHistory as i, giftFind as n, similarProducts as o, matchLook as r, frequentlyTogether as t };
