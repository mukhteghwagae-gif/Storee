import type { Product } from "../catalog";
import { lerp } from "./intelligence";
import { styleForProduct, type FaceAnchors, type Finger, type HandAnchors, type LookState } from "./types";
import type { Placement } from "./jewelry";

export type Nudge = { x: number; y: number };

function withNudge(p: Placement, n: Nudge, w: number, h: number): Placement {
  return { ...p, x: p.x + (n.x / 100) * w, y: p.y + (n.y / 100) * h };
}

export function placementsFor(
  product: Product,
  face: FaceAnchors | null,
  hands: HandAnchors[],
  canvas: { w: number; h: number },
  look: LookState,
  nudge: Nudge,
): Placement[] {
  const style = styleForProduct(product);
  const w = canvas.w;
  const h = canvas.h;
  const n = (p: Placement) => withNudge(p, nudge, w, h);

  if (style === "jhumka" || style === "hoop" || style === "pearl-stud" || style === "teardrop") {
    const fw = face?.faceWidth ?? w * 0.28;
    const scale =
      style === "jhumka" ? fw * 0.18 : style === "teardrop" ? fw * 0.16 : style === "hoop" ? fw * 0.14 : fw * 0.08;
    const left = face?.leftLobe ?? { x: w * 0.28, y: h * 0.42 };
    const right = face?.rightLobe ?? { x: w * 0.72, y: h * 0.42 };
    const yaw = face?.yaw ?? 0;
    const out: Placement[] = [];
    if (yaw < 0.32) out.push(n({ x: left.x, y: left.y, scale, rotation: 0 }));
    if (yaw > -0.32) out.push(n({ x: right.x, y: right.y, scale, rotation: 0 }));
    return out;
  }

  if (style === "tikka") {
    const hairline = face?.forehead ?? { x: w * 0.5, y: h * 0.18 };
    const pendant = face?.glabella ?? { x: w * 0.5, y: h * 0.28 };
    return [n({ x: pendant.x, y: pendant.y, scale: (face?.faceHeight ?? h * 0.4) * 0.12, rotation: 0, hairline })];
  }

  if (
    style === "paperclip" ||
    style === "figaro" ||
    style === "choker-kundan" ||
    style === "choker-moon" ||
    style === "layered-rose" ||
    style === "bridal-haar"
  ) {
    const choker = style.startsWith("choker");
    const left = face?.neckLeft ?? { x: w * 0.32, y: h * 0.62 };
    const right = face?.neckRight ?? { x: w * 0.68, y: h * 0.62 };
    const drop = choker
      ? (face?.choker ?? { x: w * 0.5, y: h * 0.58 })
      : style === "bridal-haar"
        ? (face?.neckDrop ?? { x: w * 0.5, y: h * 0.72 })
        : lerp(face?.choker ?? { x: w * 0.5, y: h * 0.58 }, face?.neckDrop ?? { x: w * 0.5, y: h * 0.7 }, 0.55);
    return [n({ x: drop.x, y: drop.y, scale: face?.faceWidth ?? w * 0.3, rotation: 0, left, right, drop })];
  }

  if (style === "thin-band" || style === "cocktail" || style === "solitaire") {
    const worn = look.rings.find((r) => r.slug === product.slug);
    const finger: Finger = worn?.finger ?? "ring";
    const hand = hands[0];
    if (hand) {
      const f = hand.fingers[finger];
      const at = lerp(f.mcp, f.pip, 0.32);
      return [n({ x: at.x, y: at.y, scale: Math.max(10, f.width * 1.6), rotation: f.angle + Math.PI / 2 })];
    }
    return [n({ x: w * 0.58, y: h * 0.72, scale: w * 0.06, rotation: -0.4 })];
  }

  if (style === "slim-bangle" || style === "kangan" || style === "tennis") {
    const hand = hands[0];
    const idx = look.wrist.indexOf(product.slug);
    const offset = (idx < 0 ? 0 : idx) * 0.18;
    if (hand) {
      const c = {
        x: hand.bangle.center.x + Math.cos(hand.bangle.angle) * hand.bangle.rx * offset,
        y: hand.bangle.center.y + Math.sin(hand.bangle.angle) * hand.bangle.ry * offset,
      };
      return [n({ x: c.x, y: c.y, scale: hand.bangle.rx * (style === "kangan" ? 1.05 : 0.95), rotation: hand.bangle.angle })];
    }
    return [n({ x: w * 0.55, y: h * 0.78, scale: w * 0.12, rotation: 0.2 })];
  }

  return [];
}
