import type { Category, Metal, Product, TryOnZone } from "../catalog.ts";

export type { TryOnZone };
export type Finger = "index" | "middle" | "ring" | "pinky";
export type FaceShape = "oval" | "round" | "heart" | "square" | "oblong";
export type Undertone = "warm" | "cool" | "neutral";
export type LightingLabel = "dim" | "good" | "bright" | "harsh";
export type TrackingState = "search" | "lock" | "lost";
export type VisionBackend = "mediapipe" | "heuristic";

export type Vec = { x: number; y: number };

export type Landmark = Vec & { z?: number };

export type FaceAnchors = {
  leftEar: Vec;
  rightEar: Vec;
  leftLobe: Vec;
  rightLobe: Vec;
  forehead: Vec;
  glabella: Vec;
  chin: Vec;
  nose: Vec;
  leftEye: Vec;
  rightEye: Vec;
  leftCheek: Vec;
  rightCheek: Vec;
  mouth: Vec;
  neckLeft: Vec;
  neckRight: Vec;
  neckDrop: Vec;
  choker: Vec;
  faceWidth: number;
  faceHeight: number;
  yaw: number;
  pitch: number;
  irisMmPerPx: number;
};

export type HandAnchors = {
  handedness: "Left" | "Right" | "Unknown";
  wrist: Vec;
  palm: Vec;
  fingers: Record<Finger, { mcp: Vec; pip: Vec; tip: Vec; width: number; angle: number }>;
  bangle: { center: Vec; rx: number; ry: number; angle: number };
};

export type FaceMetrics = {
  lengthOverWidth: number;
  jawOverCheek: number;
  foreheadOverCheek: number;
  shape: FaceShape;
  undertone: Undertone;
  lab: { l: number; a: number; b: number };
};

export type LightingInfo = {
  mean: number;
  variance: number;
  label: LightingLabel;
};

export type LookRing = { slug: string; finger: Finger };

export type LookState = {
  ear?: string;
  neck?: string;
  forehead?: string;
  wrist: string[];
  rings: LookRing[];
};

export type Intelligence = {
  shape: FaceShape;
  undertone: Undertone;
  lighting: LightingInfo;
  harmony: number;
  metalAdvice: string;
  shapeAdvice: string;
  coach: string;
  ringSizePk: number | null;
  bangleInches: string | null;
  suggestedSlugs: string[];
};

export type FrameResult = {
  face: FaceAnchors | null;
  metrics: FaceMetrics | null;
  hands: HandAnchors[];
  lighting: LightingInfo;
  tracking: TrackingState;
  backend: VisionBackend;
};

export type MetalPalette = {
  hi: string;
  a: string;
  b: string;
  c: string;
  gem: string;
};

export type JewelStyle =
  | "jhumka"
  | "hoop"
  | "pearl-stud"
  | "teardrop"
  | "thin-band"
  | "cocktail"
  | "solitaire"
  | "paperclip"
  | "figaro"
  | "choker-kundan"
  | "choker-moon"
  | "layered-rose"
  | "bridal-haar"
  | "tikka"
  | "slim-bangle"
  | "kangan"
  | "tennis";

export function zoneForCategory(category: Category): TryOnZone | null {
  switch (category) {
    case "earrings":
      return "ear";
    case "ring":
      return "hand";
    case "necklace":
      return "neck";
    case "tikka":
      return "forehead";
    case "bangle":
    case "bracelet":
      return "wrist";
    default:
      return null;
  }
}

export function emptyLook(): LookState {
  return { wrist: [], rings: [] };
}

export function lookSlugs(look: LookState): string[] {
  return [
    look.ear,
    look.neck,
    look.forehead,
    ...look.wrist,
    ...look.rings.map((r) => r.slug),
  ].filter((s): s is string => Boolean(s));
}

export function pieceCount(look: LookState): number {
  return lookSlugs(look).length;
}

export function metalPalette(metal: Metal, karat?: string, gemstone?: string | null): MetalPalette {
  const gem =
    gemstone === "emerald" || gemstone === "kundan"
      ? "#1b4332"
      : gemstone === "pearl" || gemstone === "moonstone"
        ? "#f4eee4"
        : gemstone === "cz" || gemstone === "polki"
          ? "#e8eef6"
          : "#1b4332";
  if (metal === "silver" || karat === "925") {
    return { hi: "#ffffff", a: "#f2f4f6", b: "#b7c0c8", c: "#5c6570", gem };
  }
  if (metal === "plated") {
    return { hi: "#ffe8dc", a: "#f3d3c4", b: "#c98972", c: "#8a5344", gem };
  }
  if (karat === "18k") {
    return { hi: "#fff4d6", a: "#f0d7a4", b: "#c4a36a", c: "#8a6a32", gem };
  }
  return { hi: "#fff1c2", a: "#f6d48a", b: "#d4a017", c: "#8a5a12", gem };
}

export function styleForProduct(product: Product): JewelStyle {
  switch (product.slug) {
    case "lahore-jhumkas":
      return "jhumka";
    case "gold-hoops":
      return "hoop";
    case "pearl-luna":
      return "pearl-stud";
    case "emerald-teardrop":
      return "teardrop";
    case "dawn-stack":
      return "thin-band";
    case "sultan-ring":
      return "cocktail";
    case "cz-solitaire":
      return "solitaire";
    case "thread-chain":
      return "paperclip";
    case "ravi-chain":
      return "figaro";
    case "mughal-choker":
      return "choker-kundan";
    case "moonlight-choker":
      return "choker-moon";
    case "rose-layered":
      return "layered-rose";
    case "noor-jahan":
      return "bridal-haar";
    case "sitara-tikka":
      return "tikka";
    case "whisper-bangle":
      return "slim-bangle";
    case "pair-kangan":
      return "kangan";
    case "constellation":
      return "tennis";
    default:
      break;
  }
  switch (product.category) {
    case "earrings":
      return product.gemstone === "pearl" ? "pearl-stud" : "hoop";
    case "ring":
      return product.gemstone ? "solitaire" : "thin-band";
    case "necklace":
      return "paperclip";
    case "tikka":
      return "tikka";
    case "bangle":
      return "slim-bangle";
    case "bracelet":
      return "tennis";
    default:
      return "hoop";
  }
}
