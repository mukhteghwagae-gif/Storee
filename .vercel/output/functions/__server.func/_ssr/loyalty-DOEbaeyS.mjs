//#region node_modules/.nitro/vite/services/ssr/assets/loyalty-DOEbaeyS.js
function coinsForPurchase(pkr) {
	return Math.floor(Math.max(0, pkr) / 100);
}
function makeReferralCode(seed) {
	const clean = seed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
	let hash = 0;
	for (let i = 0; i < seed.length; i++) hash = hash * 31 + seed.charCodeAt(i) | 0;
	const tail = Math.abs(hash).toString(36).toUpperCase().slice(0, 4);
	return `SITARA-${clean || "GUEST"}${tail}`;
}
//#endregion
export { makeReferralCode as n, coinsForPurchase as t };
