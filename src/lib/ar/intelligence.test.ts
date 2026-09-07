import assert from "node:assert/strict";
import { test } from "node:test";
import { PRODUCTS } from "../catalog.ts";
import {
  applyPiece,
  classifyFaceShape,
  classifyLighting,
  classifyUndertone,
  fingerWidthToPk,
  harmonyScore,
  isWorn,
  lookFromPiece,
  metalMatch,
  rgbToLab,
  shapeMatch,
  tryOnZoneFor,
  wristWidthToBangle,
} from "./intelligence.ts";
import { emptyLook } from "./types.ts";

test("try-on zone maps every wearable category", () => {
  const jhumka = PRODUCTS.find((p) => p.slug === "lahore-jhumkas")!;
  const ring = PRODUCTS.find((p) => p.slug === "dawn-stack")!;
  const tikka = PRODUCTS.find((p) => p.slug === "sitara-tikka")!;
  const bangle = PRODUCTS.find((p) => p.slug === "whisper-bangle")!;
  const haar = PRODUCTS.find((p) => p.slug === "noor-jahan")!;
  assert.equal(tryOnZoneFor(jhumka), "ear");
  assert.equal(tryOnZoneFor(ring), "hand");
  assert.equal(tryOnZoneFor(tikka), "forehead");
  assert.equal(tryOnZoneFor(bangle), "wrist");
  assert.equal(tryOnZoneFor(haar), "neck");
});

test("look builder slots and toggles by zone", () => {
  const ear = PRODUCTS.find((p) => p.slug === "gold-hoops")!;
  const ear2 = PRODUCTS.find((p) => p.slug === "pearl-luna")!;
  const ring = PRODUCTS.find((p) => p.slug === "dawn-stack")!;
  const ring2 = PRODUCTS.find((p) => p.slug === "cz-solitaire")!;
  let look = lookFromPiece(ear);
  assert.equal(look.ear, "gold-hoops");
  look = applyPiece(look, ear2);
  assert.equal(look.ear, "pearl-luna");
  look = applyPiece(look, ring);
  look = applyPiece(look, ring2);
  assert.equal(look.rings.length, 2);
  assert.equal(look.rings[0].finger, "ring");
  assert.equal(look.rings[1].finger, "middle");
  look = applyPiece(look, ring);
  assert.equal(isWorn(look, "dawn-stack"), false);
  look = applyPiece(look, ear2);
  assert.equal(look.ear, undefined);
});

test("empty look stays empty", () => {
  const look = emptyLook();
  assert.deepEqual(look, { wrist: [], rings: [] });
});

test("face shape and undertone classifiers", () => {
  assert.equal(
    classifyFaceShape({ lengthOverWidth: 1.5, jawOverCheek: 0.9, foreheadOverCheek: 0.95 }),
    "oblong",
  );
  assert.equal(
    classifyFaceShape({ lengthOverWidth: 1.1, jawOverCheek: 0.8, foreheadOverCheek: 1.12 }),
    "heart",
  );
  assert.equal(
    classifyFaceShape({ lengthOverWidth: 1.1, jawOverCheek: 0.96, foreheadOverCheek: 0.96 }),
    "round",
  );
  assert.equal(
    classifyFaceShape({ lengthOverWidth: 1.32, jawOverCheek: 0.9, foreheadOverCheek: 0.95 }),
    "oval",
  );
  const warm = classifyUndertone({ l: 65, a: 14, b: 22 });
  const cool = classifyUndertone({ l: 60, a: 2, b: 3 });
  assert.equal(warm, "warm");
  assert.equal(cool, "cool");
});

test("harmony prefers gold on warm skin and long drops on round faces", () => {
  const jhumka = PRODUCTS.find((p) => p.slug === "lahore-jhumkas")!;
  const silver = PRODUCTS.find((p) => p.slug === "cz-solitaire")!;
  const lighting = classifyLighting(0.5, 0.02);
  const goldScore = harmonyScore({
    undertone: "warm",
    shape: "round",
    lighting,
    worn: [jhumka],
  });
  const silverScore = harmonyScore({
    undertone: "warm",
    shape: "round",
    lighting,
    worn: [silver],
  });
  assert.ok(goldScore > silverScore);
  assert.ok(metalMatch("warm", "gold") > metalMatch("warm", "silver"));
  assert.ok(shapeMatch("round", "ear", "jhumka") > shapeMatch("round", "ear", "pearl-stud"));
});

test("size estimates map onto Pakistani jeweller standards", () => {
  const pk = fingerWidthToPk(17.5);
  assert.ok(pk >= 8 && pk <= 20);
  const b = wristWidthToBangle(58);
  assert.match(b, /2\.\d"/);
});

test("rgb to lab is finite and ordered", () => {
  const ivory = rgbToLab(244, 238, 228);
  const ink = rgbToLab(28, 24, 20);
  assert.ok(ivory.l > ink.l);
  assert.ok(Number.isFinite(ivory.a) && Number.isFinite(ivory.b));
});
