export const ORDER_FLOW = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "dispatched",
  "out_for_delivery",
  "delivered",
] as const;

export type OrderStatus =
  | (typeof ORDER_FLOW)[number]
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refunded";

export type PaymentStatus =
  | "unpaid"
  | "cod_pending"
  | "awaiting_transfer"
  | "awaiting_online"
  | "paid"
  | "refunded"
  | "failed";

export type ShipmentStatus =
  | "unfulfilled"
  | "packed"
  | "dispatched"
  | "out_for_delivery"
  | "delivered"
  | "returned";

export const STATUS_LABEL: Record<string, string> = {
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
  unfulfilled: "Not yet packed",
};

export const NEXT_STATUS: Record<string, string[]> = {
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
  refunded: [],
};

export function canCancel(status: string): boolean {
  return status === "pending" || status === "confirmed";
}

export function canRequestReturn(status: string): boolean {
  return status === "delivered";
}

export function initialStatuses(method: string): {
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipment_status: ShipmentStatus;
} {
  if (method === "cod") {
    return { status: "pending", payment_status: "cod_pending", shipment_status: "unfulfilled" };
  }
  if (method === "bank") {
    return { status: "pending", payment_status: "awaiting_transfer", shipment_status: "unfulfilled" };
  }
  if (method === "jazzcash" || method === "easypaisa" || method === "card") {
    return { status: "pending", payment_status: "awaiting_online", shipment_status: "unfulfilled" };
  }
  return { status: "pending", payment_status: "unpaid", shipment_status: "unfulfilled" };
}

export function shipmentForOrderStatus(status: string): ShipmentStatus | null {
  if (status === "packed") return "packed";
  if (status === "dispatched") return "dispatched";
  if (status === "out_for_delivery") return "out_for_delivery";
  if (status === "delivered") return "delivered";
  if (status === "returned") return "returned";
  if (status === "cancelled") return "unfulfilled";
  return null;
}

export function makeTrackingToken(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < 8; i++) s += alphabet[bytes[i] % alphabet.length];
  return s;
}

export function makeOrderId(): string {
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  return `ST-${Date.now().toString(36).toUpperCase()}${hex}`;
}
