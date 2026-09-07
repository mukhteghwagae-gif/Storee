//#region node_modules/.nitro/vite/services/ssr/assets/payments-B7YEvpME.js
function filled(v) {
	return Boolean(v && v.trim().length >= 4);
}
function paymentOptions(s) {
	const bankOn = filled(s.bank_iban);
	const jazz = filled(s.jazzcash_merchant_id);
	const easy = filled(s.easypaisa_store_id);
	const card = filled(s.card_public_key);
	return [
		{
			id: "cod",
			label: "Cash on delivery",
			available: s.cod_enabled,
			configured: true,
			hint: s.cod_enabled ? "Pay the courier in cash. Inspect the box before you hand over notes." : "Cash on delivery is paused today."
		},
		{
			id: "bank",
			label: "Bank transfer / Raast",
			available: bankOn,
			configured: bankOn,
			hint: bankOn ? `Transfer to ${s.bank_account_title ?? "Sitara"} · ${s.bank_name ?? "bank"} and send the receipt on WhatsApp.` : "The atelier has not published an IBAN yet."
		},
		{
			id: "jazzcash",
			label: "JazzCash",
			available: jazz,
			configured: jazz,
			hint: jazz ? "You will receive merchant instructions after placing. The order stays unpaid until the desk confirms." : "JazzCash is not connected. Ask the atelier to add a merchant id."
		},
		{
			id: "easypaisa",
			label: "Easypaisa",
			available: easy,
			configured: easy,
			hint: easy ? "You will receive store instructions after placing. The order stays unpaid until the desk confirms." : "Easypaisa is not connected."
		},
		{
			id: "card",
			label: "Card",
			available: card,
			configured: card,
			hint: card ? "Card checkout is prepared. The order stays unpaid until the processor confirms." : "Card payments are not connected."
		}
	];
}
function assertPayable(method, s) {
	const opt = paymentOptions(s).find((p) => p.id === method);
	if (!opt) throw new Error("Unknown payment method.");
	if (!opt.available) throw new Error(opt.hint);
}
//#endregion
export { paymentOptions as n, assertPayable as t };
