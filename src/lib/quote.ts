import { PRODUCT_BY_SLUG, type Product } from "./catalog.ts";
import { estimateShipping, type City, type CourierId } from "./shipping.ts";

export const GIFT_WRAP_PKR = 650;
export const STACK_BUNDLE_RATE = 0.1;
export const STACK_BUNDLE_MIN = 3;

export type QuoteItemIn = { slug: string; qty: number; size?: string };

export type Coupon = {
  code: string;
  kind: "percent" | "fixed" | "shipping";
  value: number;
  min_subtotal: number;
  max_uses: number | null;
  uses: number;
  active: boolean;
};

export type QuoteLine = {
  slug: string;
  name: string;
  qty: number;
  size?: string;
  unit: number;
  lineTotal: number;
  stackable: boolean;
};

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  stackDiscount: number;
  couponCode: string | null;
  couponDiscount: number;
  shipping: number;
  shippingLabel: string;
  days: string;
  courier: CourierId;
  giftWrap: number;
  coinDiscount: number;
  coinsUsed: number;
  storeCredit: number;
  tax: number;
  total: number;
};

export function computeQuote(opts: {
  items: QuoteItemIn[];
  catalog?: Record<string, Product>;
  city: City;
  courier: CourierId;
  freeShippingOver: number;
  coupon?: Coupon | null;
  redeemCoins?: number;
  availableCoins?: number;
  storeCreditPkr?: number;
  giftWrap?: boolean;
  giftWrapPkr?: number;
  gstBps?: number;
}): Quote {
  const catalog = opts.catalog ?? PRODUCT_BY_SLUG;
  const lines: QuoteLine[] = [];
  for (const item of opts.items) {
    const qty = Math.floor(item.qty);
    if (!Number.isFinite(qty) || qty < 1) throw new Error("Invalid quantity.");
    const p = catalog[item.slug];
    if (!p) throw new Error("A piece in your bag is no longer offered.");
    lines.push({
      slug: p.slug,
      name: p.name,
      qty,
      size: item.size,
      unit: p.price,
      lineTotal: p.price * qty,
      stackable: Boolean(p.stackable),
    });
  }
  if (lines.length === 0) throw new Error("Your bag is empty.");

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  const stackQty = lines.filter((l) => l.stackable).reduce((s, l) => s + l.qty, 0);
  const stackSub = lines.filter((l) => l.stackable).reduce((s, l) => s + l.lineTotal, 0);
  const stackDiscount =
    stackQty >= STACK_BUNDLE_MIN ? Math.round(stackSub * STACK_BUNDLE_RATE) : 0;

  const afterStack = Math.max(0, subtotal - stackDiscount);

  let couponDiscount = 0;
  let couponCode: string | null = null;
  let shippingIsFree = false;
  const coupon = opts.coupon;
  if (coupon && coupon.active && afterStack >= coupon.min_subtotal) {
    if (coupon.max_uses == null || coupon.uses < coupon.max_uses) {
      couponCode = coupon.code;
      if (coupon.kind === "percent") {
        couponDiscount = Math.round((afterStack * Math.min(coupon.value, 100)) / 100);
      } else if (coupon.kind === "fixed") {
        couponDiscount = Math.min(afterStack, Math.max(0, coupon.value));
      } else if (coupon.kind === "shipping") {
        shippingIsFree = true;
      }
    }
  }

  const afterCoupon = Math.max(0, afterStack - couponDiscount);
  const ship = estimateShipping({
    city: opts.city,
    subtotal: shippingIsFree ? opts.freeShippingOver : afterCoupon,
    freeOver: opts.freeShippingOver,
    courier: opts.courier,
  });
  const shipping = shippingIsFree ? 0 : ship.pkr;

  const giftWrap = opts.giftWrap ? Math.max(0, opts.giftWrapPkr ?? GIFT_WRAP_PKR) : 0;
  const tax = Math.round((afterCoupon * Math.max(0, opts.gstBps ?? 0)) / 10000);

  const availableCoins = Math.max(0, Math.floor(opts.availableCoins ?? 0));
  const requestedCoins = Math.max(0, Math.floor(opts.redeemCoins ?? 0));
  const coinsUsed = Math.min(availableCoins, requestedCoins, afterCoupon);
  const coinDiscount = coinsUsed;

  const storeCredit = Math.min(Math.max(0, Math.floor(opts.storeCreditPkr ?? 0)), afterCoupon - coinDiscount);

  const total = Math.max(0, afterCoupon + shipping + giftWrap + tax - coinDiscount - storeCredit);

  return {
    lines,
    subtotal,
    stackDiscount,
    couponCode,
    couponDiscount,
    shipping,
    shippingLabel: shipping === 0 ? "Complimentary" : ship.label,
    days: ship.days,
    courier: ship.courier,
    giftWrap,
    coinDiscount,
    coinsUsed,
    storeCredit,
    tax,
    total,
  };
}

export function normalizePkPhone(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (/^03\d{9}$/.test(d)) return "92" + d.slice(1);
  if (/^923\d{9}$/.test(d)) return d;
  return null;
}

export function displayPkPhone(e164: string): string {
  if (e164.startsWith("92") && e164.length === 12) return "0" + e164.slice(2);
  return e164;
}
