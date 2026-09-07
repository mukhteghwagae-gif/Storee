import assert from "node:assert/strict";
import { test } from "node:test";
import { computeQuote, normalizePkPhone } from "./quote.ts";
import { paymentOptions, assertPayable } from "./payments.ts";
import { canCancel, initialStatuses, NEXT_STATUS } from "./order.ts";
import { giftFind, quizResult, similarProducts } from "./recommendations.ts";
import { PRODUCT_BY_SLUG, PRODUCTS } from "./catalog.ts";

test("quote uses catalog prices, never a client total", () => {
  const q = computeQuote({
    items: [{ slug: "dawn-stack", qty: 2 }],
    city: "Lahore",
    courier: "leopard",
    freeShippingOver: 5000,
  });
  assert.equal(q.subtotal, PRODUCT_BY_SLUG["dawn-stack"].price * 2);
  assert.equal(q.total, q.subtotal + q.shipping + q.giftWrap + q.tax - q.couponDiscount - q.coinDiscount);
});

test("rejects unknown slugs and empty bags", () => {
  assert.throws(() =>
    computeQuote({ items: [{ slug: "no-such", qty: 1 }], city: "Lahore", courier: "leopard", freeShippingOver: 5000 }),
  );
  assert.throws(() =>
    computeQuote({ items: [], city: "Lahore", courier: "leopard", freeShippingOver: 5000 }),
  );
});

test("stack of three takes ten percent on stackable lines only", () => {
  const q = computeQuote({
    items: [
      { slug: "dawn-stack", qty: 1 },
      { slug: "whisper-bangle", qty: 1 },
      { slug: "cz-solitaire", qty: 1 },
    ],
    city: "Lahore",
    courier: "leopard",
    freeShippingOver: 5000,
  });
  assert.ok(q.stackDiscount > 0);
  const stackSub =
    PRODUCT_BY_SLUG["dawn-stack"].price +
    PRODUCT_BY_SLUG["whisper-bangle"].price +
    PRODUCT_BY_SLUG["cz-solitaire"].price;
  assert.equal(q.stackDiscount, Math.round(stackSub * 0.1));
});

test("coupon percent and shipping kinds", () => {
  const percent = computeQuote({
    items: [{ slug: "rose-layered", qty: 1 }],
    city: "Other",
    courier: "leopard",
    freeShippingOver: 5000,
    coupon: { code: "STARLIGHT10", kind: "percent", value: 10, min_subtotal: 0, max_uses: null, uses: 0, active: true },
  });
  assert.equal(percent.couponDiscount, Math.round(PRODUCT_BY_SLUG["rose-layered"].price * 0.1));
  const ship = computeQuote({
    items: [{ slug: "rose-layered", qty: 1 }],
    city: "Other",
    courier: "leopard",
    freeShippingOver: 5000,
    coupon: { code: "SHIPFREE", kind: "shipping", value: 0, min_subtotal: 0, max_uses: null, uses: 0, active: true },
  });
  assert.equal(ship.shipping, 0);
});

test("inactive coupon and coin cap", () => {
  const q = computeQuote({
    items: [{ slug: "pearl-luna", qty: 1 }],
    city: "Lahore",
    courier: "leopard",
    freeShippingOver: 5000,
    coupon: { code: "X", kind: "percent", value: 50, min_subtotal: 0, max_uses: null, uses: 0, active: false },
    redeemCoins: 999999,
    availableCoins: 40,
  });
  assert.equal(q.couponDiscount, 0);
  assert.equal(q.coinsUsed, 40);
});

test("gift wrap is added after discounts", () => {
  const q = computeQuote({
    items: [{ slug: "pearl-luna", qty: 1 }],
    city: "Lahore",
    courier: "leopard",
    freeShippingOver: 5000,
    giftWrap: true,
    giftWrapPkr: 650,
  });
  assert.equal(q.giftWrap, 650);
});

test("phone normalisation", () => {
  assert.equal(normalizePkPhone("03001234567"), "923001234567");
  assert.equal(normalizePkPhone("+92 300 1234567"), "923001234567");
  assert.equal(normalizePkPhone("123"), null);
});

test("payments stay disabled without credentials", () => {
  const opts = paymentOptions({ cod_enabled: true });
  assert.equal(opts.find((p) => p.id === "cod")?.available, true);
  assert.equal(opts.find((p) => p.id === "jazzcash")?.available, false);
  assert.equal(opts.find((p) => p.id === "card")?.available, false);
  assert.throws(() => assertPayable("jazzcash", { cod_enabled: true }));
  assert.doesNotThrow(() => assertPayable("cod", { cod_enabled: true }));
});

test("order machine", () => {
  assert.deepEqual(initialStatuses("cod").payment_status, "cod_pending");
  assert.deepEqual(initialStatuses("bank").payment_status, "awaiting_transfer");
  assert.ok(canCancel("pending"));
  assert.equal(canCancel("dispatched"), false);
  assert.ok(NEXT_STATUS.pending.includes("confirmed"));
});

test("gift finder and quiz stay inside the catalog", () => {
  const gifts = giftFind(
    { budget: "under80", occasion: "office", wearer: "self", metal: "gold" },
    PRODUCTS,
  );
  assert.ok(gifts.length > 0);
  assert.ok(gifts.every((p) => p.price <= 80000));
  const quiz = quizResult({ day: "office", metal: "yellow", voice: "quiet", budget: "daily" }, PRODUCTS);
  assert.ok(quiz.slugs.every((s) => PRODUCT_BY_SLUG[s]));
  const sim = similarProducts(PRODUCT_BY_SLUG["dawn-stack"], PRODUCTS, 3);
  assert.equal(sim.length, 3);
  assert.ok(!sim.some((p) => p.slug === "dawn-stack"));
});
