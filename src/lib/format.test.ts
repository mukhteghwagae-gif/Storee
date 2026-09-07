import assert from "node:assert/strict";
import { test } from "node:test";
import { formatPkr, parsePkr } from "./format.ts";
import { expandQuery, matchesQuery } from "./search.ts";
import { convertRingSize, circumferenceToPk } from "./sizes.ts";
import { coinsForPurchase, makeReferralCode, redeemValue } from "./loyalty.ts";
import { estimateShipping, freeShippingRemaining } from "./shipping.ts";

test("formats Pakistani grouping", () => {
  assert.equal(formatPkr(125000), "Rs 1,25,000");
  assert.equal(formatPkr(1850000), "Rs 18,50,000");
  assert.equal(formatPkr(900), "Rs 900");
  assert.equal(parsePkr("Rs 1,25,000"), 125000);
});

test("search expands ear tops to earrings", () => {
  const terms = expandQuery("ear tops");
  assert.ok(terms.includes("earrings") || terms.includes("tops"));
  assert.equal(matchesQuery("gold jhumka earrings bridal", "ear tops"), true);
  assert.equal(matchesQuery("silver payal anklets", "payal"), true);
  assert.equal(matchesQuery("gold ring", "kangan"), false);
});

test("ring size converter", () => {
  const uk = convertRingSize("M", "UK");
  assert.ok(uk);
  assert.equal(uk.pk, 12);
  const fromMm = circumferenceToPk(54.4);
  assert.equal(fromMm.pk, 13);
});

test("loyalty maths", () => {
  assert.equal(coinsForPurchase(12500), 125);
  assert.deepEqual(redeemValue(80, 50), { coinsUsed: 50, pkr: 50 });
  assert.match(makeReferralCode("user-1"), /^SITARA-/);
});

test("shipping and free threshold", () => {
  const paid = estimateShipping({ city: "Lahore", subtotal: 2000, freeOver: 5000 });
  assert.ok(paid.pkr > 0);
  const free = estimateShipping({ city: "Swabi", subtotal: 8000, freeOver: 5000 });
  assert.equal(free.pkr, 0);
  assert.equal(freeShippingRemaining(3800, 5000), 1200);
});
