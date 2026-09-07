import { r as circumferenceToPk, t as BANGLE_SIZES } from "./sizes-36DjQiLN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intelligence-wVEiNvGR.js
function zoneForCategory(category) {
	switch (category) {
		case "earrings": return "ear";
		case "ring": return "hand";
		case "necklace": return "neck";
		case "tikka": return "forehead";
		case "bangle":
		case "bracelet": return "wrist";
		default: return null;
	}
}
function emptyLook() {
	return {
		wrist: [],
		rings: []
	};
}
function lookSlugs(look) {
	return [
		look.ear,
		look.neck,
		look.forehead,
		...look.wrist,
		...look.rings.map((r) => r.slug)
	].filter((s) => Boolean(s));
}
function pieceCount(look) {
	return lookSlugs(look).length;
}
function metalPalette(metal, karat, gemstone) {
	const gem = gemstone === "emerald" || gemstone === "kundan" ? "#1b4332" : gemstone === "pearl" || gemstone === "moonstone" ? "#f4eee4" : gemstone === "cz" || gemstone === "polki" ? "#e8eef6" : "#1b4332";
	if (metal === "silver" || karat === "925") return {
		hi: "#ffffff",
		a: "#f2f4f6",
		b: "#b7c0c8",
		c: "#5c6570",
		gem
	};
	if (metal === "plated") return {
		hi: "#ffe8dc",
		a: "#f3d3c4",
		b: "#c98972",
		c: "#8a5344",
		gem
	};
	if (karat === "18k") return {
		hi: "#fff4d6",
		a: "#f0d7a4",
		b: "#c4a36a",
		c: "#8a6a32",
		gem
	};
	return {
		hi: "#fff1c2",
		a: "#f6d48a",
		b: "#d4a017",
		c: "#8a5a12",
		gem
	};
}
function styleForProduct(product) {
	switch (product.slug) {
		case "lahore-jhumkas": return "jhumka";
		case "gold-hoops": return "hoop";
		case "pearl-luna": return "pearl-stud";
		case "emerald-teardrop": return "teardrop";
		case "dawn-stack": return "thin-band";
		case "sultan-ring": return "cocktail";
		case "cz-solitaire": return "solitaire";
		case "thread-chain": return "paperclip";
		case "ravi-chain": return "figaro";
		case "mughal-choker": return "choker-kundan";
		case "moonlight-choker": return "choker-moon";
		case "rose-layered": return "layered-rose";
		case "noor-jahan": return "bridal-haar";
		case "sitara-tikka": return "tikka";
		case "whisper-bangle": return "slim-bangle";
		case "pair-kangan": return "kangan";
		case "constellation": return "tennis";
	}
	switch (product.category) {
		case "earrings": return product.gemstone === "pearl" ? "pearl-stud" : "hoop";
		case "ring": return product.gemstone ? "solitaire" : "thin-band";
		case "necklace": return "paperclip";
		case "tikka": return "tikka";
		case "bangle": return "slim-bangle";
		case "bracelet": return "tennis";
		default: return "hoop";
	}
}
function tryOnZoneFor(product) {
	return zoneForCategory(product.category) ?? product.tryOn ?? null;
}
function applyPiece(look, product) {
	const zone = tryOnZoneFor(product);
	if (!zone) return look;
	switch (zone) {
		case "ear": return {
			...look,
			ear: look.ear === product.slug ? void 0 : product.slug
		};
		case "neck": return {
			...look,
			neck: look.neck === product.slug ? void 0 : product.slug
		};
		case "forehead": return {
			...look,
			forehead: look.forehead === product.slug ? void 0 : product.slug
		};
		case "wrist": {
			const wrist = look.wrist.includes(product.slug) ? look.wrist.filter((s) => s !== product.slug) : [...look.wrist, product.slug].slice(-2);
			return {
				...look,
				wrist
			};
		}
		case "hand": {
			if (look.rings.find((r) => r.slug === product.slug)) return {
				...look,
				rings: look.rings.filter((r) => r.slug !== product.slug)
			};
			const used = new Set(look.rings.map((r) => r.finger));
			const nextFinger = [
				"ring",
				"middle",
				"index",
				"pinky"
			].find((f) => !used.has(f)) ?? "ring";
			return {
				...look,
				rings: [...look.rings, {
					slug: product.slug,
					finger: nextFinger
				}].slice(-3)
			};
		}
		default: return look;
	}
}
function isWorn(look, slug) {
	return lookSlugs(look).includes(slug);
}
function lookFromPiece(product) {
	const look = emptyLook();
	if (!product) return look;
	return applyPiece(look, product);
}
/** sRGB 0–255 → approximate CIE Lab. */
function rgbToLab(r, g, b) {
	const [R, G, B] = [
		r,
		g,
		b
	].map((v) => {
		const x = v / 255;
		return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4;
	});
	const X = R * .4124 + G * .3576 + B * .1805;
	const Y = R * .2126 + G * .7152 + B * .0722;
	const Z = R * .0193 + G * .1192 + B * .9505;
	const f = (t) => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
	const fx = f(X / .95047);
	const fy = f(Y / 1);
	const fz = f(Z / 1.08883);
	return {
		l: 116 * fy - 16,
		a: 500 * (fx - fy),
		b: 200 * (fy - fz)
	};
}
function classifyUndertone(lab) {
	if (lab.b > 12 && lab.a > 4) return "warm";
	if (lab.b < 6 && lab.a < 8) return "cool";
	if (lab.b >= 10 && lab.a >= 2) return "warm";
	if (lab.b <= 7) return "cool";
	return "neutral";
}
function classifyFaceShape(m) {
	const { lengthOverWidth: lwr, jawOverCheek: jwr, foreheadOverCheek: fwr } = m;
	if (lwr > 1.42) return "oblong";
	if (fwr > 1.06 && jwr < .86) return "heart";
	if (lwr < 1.16 && jwr > .92 && fwr > .92) return "round";
	if (lwr < 1.22 && jwr > .96 && fwr > .94) return "square";
	if (lwr < 1.18 && jwr > .9) return "round";
	return "oval";
}
function classifyLighting(mean, variance) {
	let label = "good";
	if (mean < .22) label = "dim";
	else if (variance > .085 && mean > .55) label = "harsh";
	else if (mean > .82) label = "bright";
	return {
		mean,
		variance,
		label
	};
}
function dist(a, b) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}
function lerp(a, b, t) {
	return {
		x: a.x + (b.x - a.x) * t,
		y: a.y + (b.y - a.y) * t
	};
}
var IRIS_MM = 11.7;
var IPD_MM = 63;
function mmPerPxFromFace(faceWidthPx, irisPx) {
	if (irisPx && irisPx > 2) return IRIS_MM / irisPx;
	if (faceWidthPx > 8) return IPD_MM / (faceWidthPx * .42);
	return 0;
}
function fingerWidthToPk(widthMm) {
	const circ = widthMm * Math.PI * .92;
	return circumferenceToPk(circ).pk;
}
function wristWidthToBangle(widthMm) {
	const inner = widthMm + 8;
	let best = BANGLE_SIZES[1];
	let diff = Math.abs(inner - best.mm);
	for (const s of BANGLE_SIZES) {
		const d = Math.abs(inner - s.mm);
		if (d < diff) {
			best = s;
			diff = d;
		}
	}
	return best.inches;
}
function metalMatch(undertone, metal) {
	if (undertone === "warm") return metal === "gold" ? 15 : metal === "plated" ? 8 : 2;
	if (undertone === "cool") return metal === "silver" ? 15 : metal === "plated" ? 6 : 4;
	return metal === "gold" ? 10 : 8;
}
function shapeMatch(shape, zone, styleHint) {
	if (zone !== "ear" && zone !== "neck" && zone !== "forehead") return 6;
	const longDrop = /jhumka|teardrop|haar|figaro/.test(styleHint);
	const compact = /stud|hoop|choker|pearl/.test(styleHint);
	if (shape === "round" || shape === "square") return longDrop ? 12 : compact ? 4 : 7;
	if (shape === "oblong" || shape === "heart") return compact ? 12 : longDrop ? 4 : 7;
	return 10;
}
function harmonyScore(opts) {
	if (opts.worn.length === 0) return 0;
	let score = 58;
	for (const p of opts.worn) {
		score += metalMatch(opts.undertone, p.metal) / Math.max(1, opts.worn.length);
		const zone = tryOnZoneFor(p);
		score += shapeMatch(opts.shape, zone, `${p.slug} ${p.category} ${p.gemstone ?? ""}`) / Math.max(1, opts.worn.length);
	}
	if (new Set(opts.worn.map((p) => p.metal === "plated" ? "gold" : p.metal)).size === 1) score += 6;
	else score -= 4;
	const looks = opts.worn.flatMap((p) => p.completeTheLook);
	const slugs = new Set(opts.worn.map((p) => p.slug));
	if (looks.some((s) => slugs.has(s))) score += 8;
	if (opts.lighting.label === "good") score += 6;
	if (opts.lighting.label === "dim") score -= 8;
	if (opts.lighting.label === "harsh") score -= 5;
	return Math.max(12, Math.min(99, Math.round(score)));
}
function metalAdvice(undertone) {
	if (undertone === "warm") return "Your undertone is warm — 22k yellow gold will look as if it grew there.";
	if (undertone === "cool") return "Cool undertone. Moonlight silver, or a white metal, will sit quietly true.";
	return "Neutral undertone. You can wear both houses — start with 22k and a single silver piece.";
}
function shapeAdvice(shape) {
	switch (shape) {
		case "round": return "A round face loves length. Jhumkas and teardrops draw the line downward.";
		case "square": return "A strong jaw. Soft drops and a round hoop will ease the architecture.";
		case "heart": return "A heart face. Studs, a choker, a tikka at the parting — keep the weight high.";
		case "oblong": return "A long face. Compact studs and a closed choker shorten the line, beautifully.";
		default: return "An oval face. Almost any silhouette will sit as if it was made for you.";
	}
}
function coachLine(opts) {
	if (opts.tracking === "search" || !opts.hasFace) return "Find a window. Hold the phone at eye height. We need your face in the frame.";
	if (opts.lighting.label === "dim") return "Step toward the light — gold needs a window to speak.";
	if (opts.lighting.label === "harsh") return "A little shade. The metal is bleaching in this glare.";
	if (opts.faceWidth > 0 && opts.faceWidth < opts.frameWidth * .18) return "Come a little closer — we need the line of your ears.";
	if (opts.look.ear && Math.abs(opts.yaw) > .28) return "Turn to face the mirror so both pieces can sit.";
	if ((opts.look.rings.length > 0 || opts.look.wrist.length > 0) && !opts.hasHand) return "Raise a hand into the frame — rings sit on the finger, not in theory.";
	if (opts.look.forehead && opts.yaw > .18) return "A true front — the tikka wants the parting.";
	return "Held. The piece is sitting true.";
}
function suggestedForLook(look, catalog) {
	const worn = lookSlugs(look);
	const bySlug = Object.fromEntries(catalog.map((p) => [p.slug, p]));
	const products = worn.map((s) => bySlug[s]).filter(Boolean);
	const ranked = /* @__PURE__ */ new Map();
	for (const p of products) for (const s of p.completeTheLook) {
		if (worn.includes(s)) continue;
		if (!tryOnZoneFor(bySlug[s])) continue;
		ranked.set(s, (ranked.get(s) ?? 0) + 2);
	}
	if (look.ear && !look.neck) {
		for (const p of catalog) if (p.category === "necklace" && !worn.includes(p.slug) && tryOnZoneFor(p)) ranked.set(p.slug, (ranked.get(p.slug) ?? 0) + 1);
	}
	return [...ranked.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s]) => s);
}
function buildIntelligence(opts) {
	const shape = opts.metrics?.shape ?? "oval";
	const undertone = opts.metrics?.undertone ?? "neutral";
	const bySlug = Object.fromEntries(opts.catalog.map((p) => [p.slug, p]));
	const worn = lookSlugs(opts.look).map((s) => bySlug[s]).filter(Boolean);
	const harmony = harmonyScore({
		undertone,
		shape,
		lighting: opts.lighting,
		worn
	});
	return {
		shape,
		undertone,
		lighting: opts.lighting,
		harmony,
		metalAdvice: metalAdvice(undertone),
		shapeAdvice: shapeAdvice(shape),
		coach: coachLine({
			tracking: opts.tracking,
			hasFace: Boolean(opts.metrics),
			hasHand: opts.hasHand,
			lighting: opts.lighting,
			look: opts.look,
			yaw: opts.yaw,
			faceWidth: opts.faceWidth,
			frameWidth: opts.frameWidth
		}),
		ringSizePk: opts.ringWidthMm ? fingerWidthToPk(opts.ringWidthMm) : null,
		bangleInches: opts.wristWidthMm ? wristWidthToBangle(opts.wristWidthMm) : null,
		suggestedSlugs: suggestedForLook(opts.look, opts.catalog)
	};
}
function paletteFor(product) {
	return metalPalette(product.metal, product.karat, product.gemstone);
}
//#endregion
export { classifyUndertone as a, lerp as c, mmPerPxFromFace as d, paletteFor as f, tryOnZoneFor as g, styleForProduct as h, classifyLighting as i, lookFromPiece as l, rgbToLab as m, buildIntelligence as n, dist as o, pieceCount as p, classifyFaceShape as r, isWorn as s, applyPiece as t, lookSlugs as u };
