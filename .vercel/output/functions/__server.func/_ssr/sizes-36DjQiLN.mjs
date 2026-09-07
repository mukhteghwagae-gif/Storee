//#region node_modules/.nitro/vite/services/ssr/assets/sizes-36DjQiLN.js
/** Circumference in mm for each Pakistani ring size (local jeweller standard). */
var PK_SIZES = [
	{
		pk: 8,
		mm: 48,
		uk: "I",
		us: 4.5
	},
	{
		pk: 9,
		mm: 49.3,
		uk: "J",
		us: 5
	},
	{
		pk: 10,
		mm: 50.6,
		uk: "K",
		us: 5.5
	},
	{
		pk: 11,
		mm: 51.9,
		uk: "L",
		us: 6
	},
	{
		pk: 12,
		mm: 53.1,
		uk: "M",
		us: 6.5
	},
	{
		pk: 13,
		mm: 54.4,
		uk: "N",
		us: 7
	},
	{
		pk: 14,
		mm: 55.7,
		uk: "O",
		us: 7.5
	},
	{
		pk: 15,
		mm: 57,
		uk: "P",
		us: 8
	},
	{
		pk: 16,
		mm: 58.3,
		uk: "Q",
		us: 8.5
	},
	{
		pk: 17,
		mm: 59.5,
		uk: "R",
		us: 9
	},
	{
		pk: 18,
		mm: 60.8,
		uk: "S",
		us: 9.5
	},
	{
		pk: 19,
		mm: 62.1,
		uk: "T",
		us: 10
	},
	{
		pk: 20,
		mm: 63.4,
		uk: "U",
		us: 10.5
	}
];
/** Inner diameter in inches — the measure a Pakistani goldsmith actually uses. */
var BANGLE_SIZES = [
	{
		id: "2.4",
		inches: "2.4\"",
		mm: 61
	},
	{
		id: "2.5",
		inches: "2.5\"",
		mm: 63.5
	},
	{
		id: "2.6",
		inches: "2.6\"",
		mm: 66
	},
	{
		id: "2.8",
		inches: "2.8\"",
		mm: 71.1
	}
];
function isPkRingSize(v) {
	if (!v) return false;
	const n = Number(v);
	return PK_SIZES.some((s) => s.pk === n);
}
function isBangleSize(v) {
	if (!v) return false;
	return BANGLE_SIZES.some((s) => s.id === v);
}
function convertRingSize(value, from) {
	const v = value.trim().toUpperCase();
	if (from === "PK") {
		const n = Number(v);
		return PK_SIZES.find((s) => s.pk === n) ?? null;
	}
	if (from === "UK") return PK_SIZES.find((s) => s.uk === v) ?? null;
	if (from === "US") {
		const n = Number(v);
		return PK_SIZES.find((s) => s.us === n) ?? null;
	}
	return null;
}
function circumferenceToPk(mm) {
	let best = PK_SIZES[0];
	let bestDiff = Math.abs(mm - best.mm);
	for (const s of PK_SIZES) {
		const d = Math.abs(mm - s.mm);
		if (d < bestDiff) {
			best = s;
			bestDiff = d;
		}
	}
	return best;
}
//#endregion
export { isBangleSize as a, convertRingSize as i, PK_SIZES as n, isPkRingSize as o, circumferenceToPk as r, BANGLE_SIZES as t };
