import type { Product } from "../catalog";
import { paletteFor } from "./intelligence";
import { styleForProduct, type JewelStyle, type MetalPalette, type Vec } from "./types";

export type DrawWorld = {
  ctx: CanvasRenderingContext2D;
  time: number;
  sparkle: number;
  reducedMotion: boolean;
  scaleMul: number;
};

function spark(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, a: number) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = Math.max(0.8, s * 0.12);
  ctx.beginPath();
  ctx.moveTo(x - s, y);
  ctx.lineTo(x + s, y);
  ctx.moveTo(x, y - s);
  ctx.lineTo(x, y + s);
  ctx.stroke();
  ctx.restore();
}

function goldFill(ctx: CanvasRenderingContext2D, pal: MetalPalette, x: number, y: number, r: number) {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
  g.addColorStop(0, pal.hi);
  g.addColorStop(0.35, pal.a);
  g.addColorStop(0.75, pal.b);
  g.addColorStop(1, pal.c);
  return g;
}

function metalStroke(ctx: CanvasRenderingContext2D, pal: MetalPalette, x0: number, y0: number, x1: number, y1: number) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, pal.hi);
  g.addColorStop(0.25, pal.a);
  g.addColorStop(0.5, pal.c);
  g.addColorStop(0.75, pal.b);
  g.addColorStop(1, pal.hi);
  return g;
}

function shadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
  ctx.save();
  ctx.fillStyle = "rgba(28,24,20,0.22)";
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function pearl(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  g.addColorStop(0, "#fffaf4");
  g.addColorStop(0.45, "#f4eee4");
  g.addColorStop(0.8, "#e8d6cc");
  g.addColorStop(1, "#c4a36a");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.arc(x - r * 0.28, y - r * 0.3, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
}

function gem(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, cut: "round" | "oval" | "baguette") {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = Math.max(0.6, r * 0.08);
  ctx.beginPath();
  if (cut === "baguette") {
    ctx.rect(-r * 0.35, -r * 0.9, r * 0.7, r * 1.8);
  } else if (cut === "oval") {
    ctx.ellipse(0, 0, r * 0.7, r, 0, 0, Math.PI * 2);
  } else {
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.7, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.7, 0);
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(-r * 0.18, -r * 0.25, r * 0.18, r * 0.12, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawJhumka(w: DrawWorld, x: number, y: number, s: number, pal: MetalPalette) {
  const { ctx, time, sparkle } = w;
  shadow(ctx, x, y + s * 1.55, s * 0.42, s * 0.1);
  ctx.strokeStyle = metalStroke(ctx, pal, x - s, y, x + s, y + s * 2);
  ctx.lineWidth = Math.max(1.2, s * 0.08);
  ctx.beginPath();
  ctx.arc(x, y, s * 0.22, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  ctx.fillStyle = goldFill(ctx, pal, x, y + s * 0.45, s * 0.55);
  ctx.beginPath();
  ctx.ellipse(x, y + s * 0.42, s * 0.48, s * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - s * 0.42, y + s * 0.55);
  ctx.quadraticCurveTo(x, y + s * 1.45, x + s * 0.42, y + s * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = pal.c;
  ctx.lineWidth = Math.max(0.6, s * 0.04);
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * s * 0.12, y + s * 0.58);
    ctx.quadraticCurveTo(x + i * s * 0.08, y + s * 1.05, x, y + s * 1.28);
    ctx.stroke();
  }
  pearl(ctx, x, y + s * 1.42, s * 0.16);
  const tw = w.reducedMotion ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(time * 0.004 + x));
  spark(ctx, x + s * 0.2, y + s * 0.3, s * 0.12, sparkle * tw);
}

function drawHoop(w: DrawWorld, x: number, y: number, s: number, pal: MetalPalette) {
  const { ctx, time, sparkle } = w;
  ctx.strokeStyle = metalStroke(ctx, pal, x - s, y - s, x + s, y + s);
  ctx.lineWidth = Math.max(2, s * 0.22);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(x, y + s * 0.15, s * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = pal.hi;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = Math.max(1, s * 0.06);
  ctx.beginPath();
  ctx.arc(x, y + s * 0.15, s * 0.72, -0.8, 0.4);
  ctx.stroke();
  ctx.globalAlpha = 1;
  const tw = w.reducedMotion ? 0.5 : 0.4 + 0.6 * Math.abs(Math.sin(time * 0.005 + y));
  spark(ctx, x + s * 0.45, y - s * 0.2, s * 0.1, sparkle * tw);
}

function drawPearlStud(w: DrawWorld, x: number, y: number, s: number, pal: MetalPalette) {
  const { ctx } = w;
  ctx.fillStyle = goldFill(ctx, pal, x, y, s * 0.28);
  ctx.beginPath();
  ctx.arc(x, y, s * 0.22, 0, Math.PI * 2);
  ctx.fill();
  pearl(ctx, x, y, s * 0.42);
}

function drawTeardrop(w: DrawWorld, x: number, y: number, s: number, pal: MetalPalette) {
  const { ctx, sparkle, time } = w;
  ctx.fillStyle = goldFill(ctx, pal, x, y, s * 0.3);
  ctx.beginPath();
  ctx.arc(x, y, s * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = pal.b;
  ctx.lineWidth = Math.max(1, s * 0.06);
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.16);
  ctx.lineTo(x, y + s * 0.38);
  ctx.stroke();
  gem(ctx, x, y + s * 0.85, s * 0.42, pal.gem, "oval");
  ctx.strokeStyle = pal.a;
  ctx.lineWidth = Math.max(1, s * 0.07);
  ctx.beginPath();
  ctx.ellipse(x, y + s * 0.85, s * 0.55, s * 0.72, 0, 0, Math.PI * 2);
  ctx.stroke();
  spark(ctx, x + s * 0.18, y + s * 0.62, s * 0.12, sparkle * (0.5 + 0.5 * Math.sin(time * 0.006)));
}

function drawBand(w: DrawWorld, x: number, y: number, s: number, pal: MetalPalette, angle: number, kind: "thin" | "cocktail" | "solitaire") {
  const { ctx, sparkle, time } = w;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const rx = s * (kind === "cocktail" ? 1.15 : 0.95);
  const ry = s * 0.38;
  shadow(ctx, 0, s * 0.35, rx * 0.9, ry * 0.45);
  ctx.strokeStyle = metalStroke(ctx, pal, -rx, 0, rx, 0);
  ctx.lineWidth = kind === "thin" ? Math.max(1.6, s * 0.22) : Math.max(2.2, s * 0.32);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.strokeStyle = pal.hi;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = Math.max(0.8, s * 0.08);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0.4, 1.2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  if (kind === "thin") gem(ctx, 0, -ry * 0.2, s * 0.22, pal.gem, "baguette");
  if (kind === "solitaire") gem(ctx, 0, -ry * 0.35, s * 0.42, pal.gem, "round");
  if (kind === "cocktail") gem(ctx, 0, -ry * 0.2, s * 0.7, pal.gem, "oval");
  spark(ctx, s * 0.15, -s * 0.35, s * 0.1, sparkle * (0.5 + 0.5 * Math.sin(time * 0.007)));
  ctx.restore();
}

function chainPoints(left: Vec, right: Vec, drop: Vec, n: number): Vec[] {
  const pts: Vec[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    pts.push({
      x: u * u * left.x + 2 * u * t * drop.x + t * t * right.x,
      y: u * u * left.y + 2 * u * t * drop.y + t * t * right.y,
    });
  }
  return pts;
}

function drawLinks(ctx: CanvasRenderingContext2D, pts: Vec[], pal: MetalPalette, w: number, kind: "paperclip" | "figaro") {
  ctx.strokeStyle = metalStroke(ctx, pal, pts[0].x, pts[0].y, pts[pts.length - 1].x, pts[pts.length - 1].y);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    ctx.lineWidth = kind === "figaro" && i % 3 === 0 ? w * 1.6 : w;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

function drawNecklace(
  w: DrawWorld,
  left: Vec,
  right: Vec,
  drop: Vec,
  pal: MetalPalette,
  style: "paperclip" | "figaro" | "choker-kundan" | "choker-moon" | "layered-rose" | "bridal-haar",
) {
  const { ctx, sparkle, time } = w;
  const width = Math.hypot(right.x - left.x, right.y - left.y);
  if (style === "layered-rose") {
    for (const k of [0.7, 1, 1.28]) {
      const d = { x: drop.x, y: left.y + (drop.y - left.y) * k };
      drawLinks(ctx, chainPoints(left, right, d, 18), pal, Math.max(1.2, width * 0.012), "paperclip");
    }
    return;
  }
  const choker = style.startsWith("choker") || style === "bridal-haar";
  const pts = chainPoints(left, right, drop, choker ? 22 : 16);
  drawLinks(ctx, pts, pal, Math.max(1.3, width * (style === "figaro" ? 0.022 : 0.014)), style === "figaro" ? "figaro" : "paperclip");
  const mid = pts[Math.floor(pts.length / 2)];
  if (style === "choker-kundan" || style === "bridal-haar") {
    const count = style === "bridal-haar" ? 7 : 5;
    for (let i = 0; i < count; i++) {
      const p = pts[Math.round(((i + 1) / (count + 1)) * (pts.length - 1))];
      ctx.fillStyle = goldFill(ctx, pal, p.x, p.y, width * 0.04);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + width * 0.02, width * 0.028, width * 0.038, 0, 0, Math.PI * 2);
      ctx.fill();
      gem(ctx, p.x, p.y + width * 0.02, width * 0.016, pal.gem, "round");
    }
  }
  if (style === "choker-moon") {
    for (const p of [pts[6], mid, pts[pts.length - 7]]) {
      pearl(ctx, p.x, p.y + width * 0.012, width * 0.022);
    }
  }
  if (style === "bridal-haar") {
    gem(ctx, mid.x, mid.y + width * 0.06, width * 0.04, pal.gem, "oval");
  }
  spark(ctx, mid.x + 4, mid.y, width * 0.012, sparkle * (0.4 + 0.6 * Math.abs(Math.sin(time * 0.004))));
}

function drawTikka(w: DrawWorld, hairline: Vec, pendant: Vec, pal: MetalPalette) {
  const { ctx, sparkle, time } = w;
  const s = Math.hypot(pendant.x - hairline.x, pendant.y - hairline.y) || 24;
  ctx.strokeStyle = metalStroke(ctx, pal, hairline.x, hairline.y, pendant.x, pendant.y);
  ctx.lineWidth = Math.max(1.2, s * 0.06);
  ctx.beginPath();
  ctx.moveTo(hairline.x, hairline.y);
  ctx.quadraticCurveTo(hairline.x, (hairline.y + pendant.y) / 2, pendant.x, pendant.y);
  ctx.stroke();
  ctx.fillStyle = goldFill(ctx, pal, pendant.x, pendant.y, s * 0.28);
  ctx.beginPath();
  ctx.arc(pendant.x, pendant.y, s * 0.22, 0, Math.PI * 2);
  ctx.fill();
  gem(ctx, pendant.x, pendant.y, s * 0.16, pal.gem, "round");
  pearl(ctx, pendant.x, pendant.y + s * 0.32, s * 0.08);
  spark(ctx, pendant.x + s * 0.12, pendant.y - s * 0.1, s * 0.08, sparkle * (0.5 + 0.5 * Math.sin(time * 0.005)));
}

function drawBangle(w: DrawWorld, c: Vec, rx: number, ry: number, angle: number, pal: MetalPalette, thick: boolean) {
  const { ctx, sparkle, time } = w;
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(angle);
  ctx.strokeStyle = metalStroke(ctx, pal, -rx, 0, rx, 0);
  ctx.lineWidth = thick ? Math.max(3, rx * 0.16) : Math.max(2, rx * 0.08);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (thick) {
    ctx.strokeStyle = pal.c;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * rx * 0.92, Math.sin(a) * ry * 0.92, rx * 0.04, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  spark(ctx, rx * 0.55, -ry * 0.2, rx * 0.06, sparkle * (0.4 + 0.6 * Math.sin(time * 0.005)));
  ctx.restore();
}

function drawTennis(w: DrawWorld, c: Vec, rx: number, ry: number, angle: number, pal: MetalPalette) {
  const { ctx } = w;
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(angle);
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = Math.cos(a) * rx;
    const y = Math.sin(a) * ry;
    gem(ctx, x, y, Math.max(2.2, rx * 0.07), pal.gem, "round");
  }
  ctx.restore();
}

function drawStyle(w: DrawWorld, style: JewelStyle, pal: MetalPalette, at: Placement) {
  const s = at.scale * w.scaleMul;
  switch (style) {
    case "jhumka":
      drawJhumka(w, at.x, at.y, s, pal);
      break;
    case "hoop":
      drawHoop(w, at.x, at.y, s, pal);
      break;
    case "pearl-stud":
      drawPearlStud(w, at.x, at.y, s, pal);
      break;
    case "teardrop":
      drawTeardrop(w, at.x, at.y, s, pal);
      break;
    case "thin-band":
      drawBand(w, at.x, at.y, s, pal, at.rotation, "thin");
      break;
    case "cocktail":
      drawBand(w, at.x, at.y, s, pal, at.rotation, "cocktail");
      break;
    case "solitaire":
      drawBand(w, at.x, at.y, s, pal, at.rotation, "solitaire");
      break;
    case "tikka":
      if (at.hairline) drawTikka(w, at.hairline, { x: at.x, y: at.y }, pal);
      break;
    case "slim-bangle":
      drawBangle(w, { x: at.x, y: at.y }, s, s * 0.42, at.rotation, pal, false);
      break;
    case "kangan":
      drawBangle(w, { x: at.x, y: at.y }, s, s * 0.46, at.rotation, pal, true);
      break;
    case "tennis":
      drawTennis(w, { x: at.x, y: at.y }, s, s * 0.4, at.rotation, pal);
      break;
    default:
      if (at.left && at.right && at.drop) {
        drawNecklace(w, at.left, at.right, at.drop, pal, style as "paperclip");
      }
  }
}

export type Placement = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  hairline?: Vec;
  left?: Vec;
  right?: Vec;
  drop?: Vec;
};

export function drawProduct(w: DrawWorld, product: Product, placements: Placement[]) {
  const pal = paletteFor(product);
  const style = styleForProduct(product);
  for (const at of placements) drawStyle(w, style, pal, at);
}

export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createRadialGradient(w / 2, h * 0.42, h * 0.2, w / 2, h * 0.5, h * 0.78);
  g.addColorStop(0, "rgba(28,24,20,0)");
  g.addColorStop(1, "rgba(28,24,20,0.38)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function drawScan(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const y = ((t * 0.08) % (h + 80)) - 40;
  const g = ctx.createLinearGradient(0, y - 30, 0, y + 30);
  g.addColorStop(0, "rgba(196,163,106,0)");
  g.addColorStop(0.5, "rgba(196,163,106,0.28)");
  g.addColorStop(1, "rgba(196,163,106,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, y - 30, w, 60);
}

export function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = "rgba(244,238,228,0.78)";
  ctx.font = `500 ${Math.max(14, w * 0.028)}px "Cormorant Garamond", serif`;
  ctx.textAlign = "right";
  ctx.fillText("Sitara", w - 18, h - 22);
  ctx.restore();
}
