//#region node_modules/.nitro/vite/services/ssr/assets/order-BuQcDLgy.js
var STATUS_LABEL = {
	pending: "Pending",
	confirmed: "Confirmed",
	processing: "Processing",
	packed: "Packed",
	dispatched: "Dispatched",
	out_for_delivery: "Out for delivery",
	delivered: "Delivered",
	cancelled: "Cancelled",
	return_requested: "Return requested",
	returned: "Returned",
	refunded: "Refunded",
	unpaid: "Unpaid",
	cod_pending: "Cash on delivery",
	awaiting_transfer: "Awaiting bank transfer",
	awaiting_online: "Awaiting payment",
	paid: "Paid",
	failed: "Failed",
	unfulfilled: "Not yet packed"
};
var NEXT_STATUS = {
	pending: ["confirmed", "cancelled"],
	confirmed: ["processing", "cancelled"],
	processing: ["packed", "cancelled"],
	packed: ["dispatched"],
	dispatched: ["out_for_delivery"],
	out_for_delivery: ["delivered"],
	delivered: ["return_requested"],
	return_requested: ["returned", "delivered"],
	returned: ["refunded"],
	cancelled: [],
	refunded: []
};
function canCancel(status) {
	return status === "pending" || status === "confirmed";
}
function canRequestReturn(status) {
	return status === "delivered";
}
function initialStatuses(method) {
	if (method === "cod") return {
		status: "pending",
		payment_status: "cod_pending",
		shipment_status: "unfulfilled"
	};
	if (method === "bank") return {
		status: "pending",
		payment_status: "awaiting_transfer",
		shipment_status: "unfulfilled"
	};
	if (method === "jazzcash" || method === "easypaisa" || method === "card") return {
		status: "pending",
		payment_status: "awaiting_online",
		shipment_status: "unfulfilled"
	};
	return {
		status: "pending",
		payment_status: "unpaid",
		shipment_status: "unfulfilled"
	};
}
function shipmentForOrderStatus(status) {
	if (status === "packed") return "packed";
	if (status === "dispatched") return "dispatched";
	if (status === "out_for_delivery") return "out_for_delivery";
	if (status === "delivered") return "delivered";
	if (status === "returned") return "returned";
	if (status === "cancelled") return "unfulfilled";
	return null;
}
function makeTrackingToken() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	const bytes = /* @__PURE__ */ new Uint8Array(8);
	crypto.getRandomValues(bytes);
	let s = "";
	for (let i = 0; i < 8; i++) s += alphabet[bytes[i] % 32];
	return s;
}
function makeOrderId() {
	const bytes = /* @__PURE__ */ new Uint8Array(3);
	crypto.getRandomValues(bytes);
	const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
	return `ST-${Date.now().toString(36).toUpperCase()}${hex}`;
}
//#endregion
export { initialStatuses as a, shipmentForOrderStatus as c, canRequestReturn as i, STATUS_LABEL as n, makeOrderId as o, canCancel as r, makeTrackingToken as s, NEXT_STATUS as t };
