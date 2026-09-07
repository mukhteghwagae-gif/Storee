import type { Product } from "../catalog.ts";
import { circumferenceToPk, BANGLE_SIZES } from "../sizes.ts";
import {
  emptyLook,
  lookSlugs,
  metalPalette,
  zoneForCategory,
  type FaceMetrics,
  type FaceShape,
  type Finger,
  type Intelligence,
  type LightingInfo,
  type LookState,
  type TryOnZone,
  type Undertone,
  type Vec,
} from "./types.ts";

export function tryOnZoneFor(product: Product): TryOnZone | null {
  return zoneForCategory(product.category) ?? product.tryOn ?? null;
}

export function applyPiece(look: LookState, product: Product): LookState {
  const zone = tryOnZoneFor(product);
  if (!zone) return look;
  switch (zone) {
    case "ear":
      return { ...look, ear: look.ear === product.slug ? undefined : product.slug };
    case "neck":
      return { ...look, neck: look.neck === product.slug ? undefined : product.slug };
    case "forehead":
      return { ...look, forehead: look.forehead === product.slug ? undefined : product.slug };
    case "wrist": {
      const on = look.wrist.includes(product.slug);
      const wrist = on ? look.wrist.filter((s) => s !== product.slug) : [...look.wrist, product.slug].slice(-2);
      return { ...look, wrist };
    }
    case "hand": {
      const existing = look.rings.find((r) => r.slug === product.slug);
      if (existing) return { ...look, rings: look.rings.filter((r) => r.slug !== product.slug) };
      const used = new Set(look.rings.map((r) => r.finger));
      const nextFinger = (["ring", "middle", "index", "pinky"] as Finger[]).find((f) => !used.has(f)) ?? "ring";
      return { ...look, rings: [...look.rings, { slug: product.slug, finger: nextFinger }].slice(-3) };
    }
    default:
      return look;
  }
}

export function isWorn(look: LookState, slug: string): boolean {
  return lookSlugs(look).includes(slug);
}

export function lookFromPiece(product: Product | undefined): LookState {
  const look = emptyLook();
  if (!product) return look;
  return applyPiece(look, product);
}

/** sRGB 0–255 → approximate CIE Lab. */
export function rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
  const srgb = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  const [R, G, B] = srgb;
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(X / 0.95047);
  const fy = f(Y / 1);
  const fz = f(Z / 1.08883);
  return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

export function classifyUndertone(lab: { l: number; a: number; b: number }): Undertone {
  if (lab.b > 12 && lab.a > 4) return "warm";
  if (lab.b < 6 && lab.a < 8) return "cool";
  if (lab.b >= 10 && lab.a >= 2) return "warm";
  if (lab.b <= 7) return "cool";
  return "neutral";
}

export function classifyFaceShape(m: {
  lengthOverWidth: number;
  jawOverCheek: number;
  foreheadOverCheek: number;
}): FaceShape {
  const { lengthOverWidth: lwr, jawOverCheek: jwr, foreheadOverCheek: fwr } = m;
  if (lwr > 1.42) return "oblong";
  if (fwr > 1.06 && jwr < 0.86) return "heart";
  if (lwr < 1.16 && jwr > 0.92 && fwr > 0.92) return "round";
  if (lwr < 1.22 && jwr > 0.96 && fwr > 0.94) return "square";
  if (lwr < 1.18 && jwr > 0.9) return "round";
  return "oval";
}

export function classifyLighting(mean: number, variance: number): LightingInfo {
  let label: LightingInfo["label"] = "good";
  if (mean < 0.22) label = "dim";
  else if (variance > 0.085 && mean > 0.55) label = "harsh";
  else if (mean > 0.82) label = "bright";
  return { mean, variance, label };
}

export function dist(a: Vec, b: Vec): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function lerp(a: Vec, b: Vec, t: number): Vec {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function angleOf(a: Vec, b: Vec): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

const IRIS_MM = 11.7;
const IPD_MM = 63;

export function mmPerPxFromFace(faceWidthPx: number, irisPx?: number): number {
  if (irisPx && irisPx > 2) return IRIS_MM / irisPx;
  if (faceWidthPx > 8) return IPD_MM / (faceWidthPx * 0.42);
  return 0;
}

export function fingerWidthToPk(widthMm: number): number {
  const circ = widthMm * Math.PI * 0.92;
  return circumferenceToPk(circ).pk;
}

export function wristWidthToBangle(widthMm: number): string {
  const inner = widthMm + 8;
  let best = BANGLE_SIZES[1];
  let diff = Math.abs(inner - best.mm);
  for (const s of BANGLE_SIZES) {
    const d = Math.abs(inner - s.mm);
    if (d < diff) {
      best = s;
      diff = d;
    }
  }
  return best.inches;
}

export function metalMatch(undertone: Undertone, metal: Product["metal"]): number {
  if (undertone === "warm") return metal === "gold" ? 15 : metal === "plated" ? 8 : 2;
  if (undertone === "cool") return metal === "silver" ? 15 : metal === "plated" ? 6 : 4;
  return metal === "gold" ? 10 : 8;
}

export function shapeMatch(shape: FaceShape, zone: TryOnZone | null, styleHint: string): number {
  if (zone !== "ear" && zone !== "neck" && zone !== "forehead") return 6;
  const longDrop = /jhumka|teardrop|haar|figaro/.test(styleHint);
  const compact = /stud|hoop|choker|pearl/.test(styleHint);
  if (shape === "round" || shape === "square") return longDrop ? 12 : compact ? 4 : 7;
  if (shape === "oblong" || shape === "heart") return compact ? 12 : longDrop ? 4 : 7;
  return 10;
}

export function harmonyScore(opts: {
  undertone: Undertone;
  shape: FaceShape;
  lighting: LightingInfo;
  worn: Product[];
}): number {
  if (opts.worn.length === 0) return 0;
  let score = 58;
  for (const p of opts.worn) {
    score += metalMatch(opts.undertone, p.metal) / Math.max(1, opts.worn.length);
    const zone = tryOnZoneFor(p);
    score += shapeMatch(opts.shape, zone, `${p.slug} ${p.category} ${p.gemstone ?? ""}`) / Math.max(1, opts.worn.length);
  }
  const metals = new Set(opts.worn.map((p) => (p.metal === "plated" ? "gold" : p.metal)));
  if (metals.size === 1) score += 6;
  else score -= 4;
  const looks = opts.worn.flatMap((p) => p.completeTheLook);
  const slugs = new Set(opts.worn.map((p) => p.slug));
  if (looks.some((s) => slugs.has(s))) score += 8;
  if (opts.lighting.label === "good") score += 6;
  if (opts.lighting.label === "dim") score -= 8;
  if (opts.lighting.label === "harsh") score -= 5;
  return Math.max(12, Math.min(99, Math.round(score)));
}

export function metalAdvice(undertone: Undertone): string {
  if (undertone === "warm") return "Your undertone is warm — 22k yellow gold will look as if it grew there.";
  if (undertone === "cool") return "Cool undertone. Moonlight silver, or a white metal, will sit quietly true.";
  return "Neutral undertone. You can wear both houses — start with 22k and a single silver piece.";
}

export function shapeAdvice(shape: FaceShape): string {
  switch (shape) {
    case "round":
      return "A round face loves length. Jhumkas and teardrops draw the line downward.";
    case "square":
      return "A strong jaw. Soft drops and a round hoop will ease the architecture.";
    case "heart":
      return "A heart face. Studs, a choker, a tikka at the parting — keep the weight high.";
    case "oblong":
      return "A long face. Compact studs and a closed choker shorten the line, beautifully.";
    default:
      return "An oval face. Almost any silhouette will sit as if it was made for you.";
  }
}

export function coachLine(opts: {
  tracking: "search" | "lock" | "lost";
  hasFace: boolean;
  hasHand: boolean;
  lighting: LightingInfo;
  look: LookState;
  yaw: number;
  faceWidth: number;
  frameWidth: number;
}): string {
  if (opts.tracking === "search" || !opts.hasFace) {
    return "Find a window. Hold the phone at eye height. We need your face in the frame.";
  }
  if (opts.lighting.label === "dim") return "Step toward the light — gold needs a window to speak.";
  if (opts.lighting.label === "harsh") return "A little shade. The metal is bleaching in this glare.";
  if (opts.faceWidth > 0 && opts.faceWidth < opts.frameWidth * 0.18) {
    return "Come a little closer — we need the line of your ears.";
  }
  if (opts.look.ear && Math.abs(opts.yaw) > 0.28) {
    return "Turn to face the mirror so both pieces can sit.";
  }
  if ((opts.look.rings.length > 0 || opts.look.wrist.length > 0) && !opts.hasHand) {
    return "Raise a hand into the frame — rings sit on the finger, not in theory.";
  }
  if (opts.look.forehead && opts.yaw > 0.18) return "A true front — the tikka wants the parting.";
  return "Held. The piece is sitting true.";
}

export function suggestedForLook(look: LookState, catalog: Product[]): string[] {
  const worn = lookSlugs(look);
  const bySlug = Object.fromEntries(catalog.map((p) => [p.slug, p]));
  const products = worn.map((s) => bySlug[s]).filter(Boolean);
  const ranked = new Map<string, number>();
  for (const p of products) {
    for (const s of p.completeTheLook) {
      if (worn.includes(s)) continue;
      if (!tryOnZoneFor(bySlug[s])) continue;
      ranked.set(s, (ranked.get(s) ?? 0) + 2);
    }
  }
  if (look.ear && !look.neck) {
    for (const p of catalog) {
      if (p.category === "necklace" && !worn.includes(p.slug) && tryOnZoneFor(p)) {
        ranked.set(p.slug, (ranked.get(p.slug) ?? 0) + 1);
      }
    }
  }
  return [...ranked.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([s]) => s);
}

export function buildIntelligence(opts: {
  metrics: FaceMetrics | null;
  lighting: LightingInfo;
  look: LookState;
  catalog: Product[];
  tracking: "search" | "lock" | "lost";
  hasHand: boolean;
  yaw: number;
  faceWidth: number;
  frameWidth: number;
  ringWidthMm: number | null;
  wristWidthMm: number | null;
}): Intelligence {
  const shape = opts.metrics?.shape ?? "oval";
  const undertone = opts.metrics?.undertone ?? "neutral";
  const bySlug = Object.fromEntries(opts.catalog.map((p) => [p.slug, p]));
  const worn = lookSlugs(opts.look)
    .map((s) => bySlug[s])
    .filter(Boolean);
  const harmony = harmonyScore({ undertone, shape, lighting: opts.lighting, worn });
  return {
    shape,
    undertone,
    lighting: opts.lighting,
    harmony,
    metalAdvice: metalAdvice(undertone),
    shapeAdvice: shapeAdvice(shape),
    coach: coachLine({
      tracking: opts.tracking,
      hasFace: Boolean(opts.metrics),
      hasHand: opts.hasHand,
      lighting: opts.lighting,
      look: opts.look,
      yaw: opts.yaw,
      faceWidth: opts.faceWidth,
      frameWidth: opts.frameWidth,
    }),
    ringSizePk: opts.ringWidthMm ? fingerWidthToPk(opts.ringWidthMm) : null,
    bangleInches: opts.wristWidthMm ? wristWidthToBangle(opts.wristWidthMm) : null,
    suggestedSlugs: suggestedForLook(opts.look, opts.catalog),
  };
}

export function paletteFor(product: Product) {
  return metalPalette(product.metal, product.karat, product.gemstone);
}
