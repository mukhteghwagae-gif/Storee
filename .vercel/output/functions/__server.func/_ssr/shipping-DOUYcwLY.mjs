//#region node_modules/.nitro/vite/services/ssr/assets/shipping-DOUYcwLY.js
var CITIES = [
	"Lahore",
	"Karachi",
	"Islamabad",
	"Rawalpindi",
	"Faisalabad",
	"Multan",
	"Peshawar",
	"Swabi",
	"Topi",
	"Mardan",
	"Abbottabad",
	"Quetta",
	"Hyderabad",
	"Sialkot",
	"Gujranwala",
	"Bahawalpur",
	"Sukkur",
	"Mingora",
	"Kohat",
	"Dera Ismail Khan",
	"Other"
];
var METRO = /* @__PURE__ */ new Set([
	"Lahore",
	"Karachi",
	"Islamabad",
	"Rawalpindi"
]);
function estimateShipping(opts) {
	const courier = opts.courier ?? "leopard";
	if (opts.subtotal >= opts.freeOver) return {
		pkr: 0,
		days: METRO.has(opts.city) ? "1–2" : "2–4",
		courier,
		label: "Complimentary"
	};
	const base = METRO.has(opts.city) ? 250 : opts.city === "Other" ? 450 : 320;
	const bump = courier === "tcs" ? 40 : courier === "call" ? -20 : 0;
	const days = METRO.has(opts.city) ? "1–3" : "3–5";
	return {
		pkr: base + bump,
		days,
		courier,
		label: courierLabel(courier)
	};
}
function courierLabel(id) {
	if (id === "tcs") return "TCS";
	if (id === "call") return "Call Courier";
	return "Leopard Courier";
}
function isCity(v) {
	return CITIES.includes(v);
}
//#endregion
export { estimateShipping as n, isCity as r, CITIES as t };
