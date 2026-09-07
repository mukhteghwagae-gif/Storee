import { VecFilter } from "./filter";
import { classifyFaceShape, classifyLighting, classifyUndertone, dist, lerp, rgbToLab } from "./intelligence";
import type {
  FaceAnchors,
  FaceMetrics,
  FrameResult,
  HandAnchors,
  Landmark,
  LightingInfo,
  TrackingState,
  Vec,
  VisionBackend,
} from "./types";

const VISION_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18";
const FACE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const HAND_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

type MpFace = {
  detect: (image: HTMLCanvasElement | HTMLImageElement) => { faceLandmarks?: Landmark[][] };
  close?: () => void;
};
type MpHand = {
  detect: (image: HTMLCanvasElement | HTMLImageElement) => {
    landmarks?: Landmark[][];
    handedness?: { categoryName: string }[][];
  };
  close?: () => void;
};

function lm(list: Landmark[], i: number): Vec {
  const p = list[i] ?? { x: 0.5, y: 0.5 };
  return { x: p.x, y: p.y };
}

function toPx(p: Vec, w: number, h: number): Vec {
  return { x: p.x * w, y: p.y * h };
}

function faceFromLandmarks(list: Landmark[], w: number, h: number): FaceAnchors {
  const L = (i: number) => toPx(lm(list, i), w, h);
  const leftEye = L(33);
  const rightEye = L(263);
  const chin = L(152);
  const forehead = L(10);
  const nose = L(1);
  const leftCheek = L(234);
  const rightCheek = L(454);
  const leftLobe = L(132);
  const rightLobe = L(361);
  const faceWidth = dist(leftCheek, rightCheek);
  const faceHeight = dist(forehead, chin);
  const midX = (leftCheek.x + rightCheek.x) / 2;
  const yaw = faceWidth > 1 ? (nose.x - midX) / faceWidth : 0;
  const eyeMid = lerp(leftEye, rightEye, 0.5);
  const pitch = faceHeight > 1 ? (nose.y - eyeMid.y) / faceHeight : 0;
  const iris = list[468] && list[473] ? dist(L(468), L(469) ?? L(468)) : 0;
  const down = faceWidth * 0.42;
  return {
    leftEar: leftCheek,
    rightEar: rightCheek,
    leftLobe: { x: leftLobe.x, y: leftLobe.y + faceHeight * 0.04 },
    rightLobe: { x: rightLobe.x, y: rightLobe.y + faceHeight * 0.04 },
    forehead,
    glabella: L(9),
    chin,
    nose,
    leftEye,
    rightEye,
    leftCheek,
    rightCheek,
    mouth: L(13),
    neckLeft: { x: leftCheek.x - faceWidth * 0.02, y: chin.y + down * 0.55 },
    neckRight: { x: rightCheek.x + faceWidth * 0.02, y: chin.y + down * 0.55 },
    neckDrop: { x: chin.x, y: chin.y + down * 1.05 },
    choker: { x: chin.x, y: chin.y + down * 0.38 },
    faceWidth,
    faceHeight,
    yaw,
    pitch,
    irisMmPerPx: iris > 2 ? 11.7 / iris : 0,
  };
}

function handFromLandmarks(list: Landmark[], handedness: string, w: number, h: number): HandAnchors {
  const P = (i: number) => toPx(lm(list, i), w, h);
  const finger = (mcp: number, pip: number, tip: number) => {
    const a = P(mcp);
    const b = P(pip);
    const c = P(tip);
    return {
      mcp: a,
      pip: b,
      tip: c,
      width: dist(a, b) * 0.38,
      angle: Math.atan2(b.y - a.y, b.x - a.x),
    };
  };
  const wrist = P(0);
  const middleMcp = P(9);
  const thumb = P(1);
  const palm = lerp(wrist, middleMcp, 0.45);
  const axis = Math.atan2(middleMcp.y - wrist.y, middleMcp.x - wrist.x);
  const span = dist(wrist, thumb) * 1.35;
  return {
    handedness: handedness === "Left" || handedness === "Right" ? handedness : "Unknown",
    wrist,
    palm,
    fingers: {
      index: finger(5, 6, 8),
      middle: finger(9, 10, 12),
      ring: finger(13, 14, 16),
      pinky: finger(17, 18, 20),
    },
    bangle: {
      center: lerp(wrist, middleMcp, 0.12),
      rx: span,
      ry: span * 0.42,
      angle: axis + Math.PI / 2,
    },
  };
}

function isSkin(r: number, g: number, b: number) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return y > 40 && y < 245 && cb > 77 && cb < 135 && cr > 130 && cr < 180 && r > g - 10 && r > 60;
}

function largestBlob(mask: Uint8Array, w: number, h: number): { x0: number; y0: number; x1: number; y1: number; n: number } | null {
  const seen = new Uint8Array(w * h);
  let best: { x0: number; y0: number; x1: number; y1: number; n: number } | null = null;
  const qx: number[] = [];
  const qy: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i] || seen[i]) continue;
      qx.length = 0;
      qy.length = 0;
      qx.push(x);
      qy.push(y);
      seen[i] = 1;
      let n = 0;
      let x0 = x,
        y0 = y,
        x1 = x,
        y1 = y;
      while (qx.length) {
        const cx = qx.pop()!;
        const cy = qy.pop()!;
        n++;
        if (cx < x0) x0 = cx;
        if (cy < y0) y0 = cy;
        if (cx > x1) x1 = cx;
        if (cy > y1) y1 = cy;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const ni = ny * w + nx;
          if (!mask[ni] || seen[ni]) continue;
          seen[ni] = 1;
          qx.push(nx);
          qy.push(ny);
        }
      }
      if (!best || n > best.n) best = { x0, y0, x1, y1, n };
    }
  }
  return best;
}

function heuristicFace(imageData: ImageData, outW: number, outH: number): FaceAnchors | null {
  const { width: w, height: h, data } = imageData;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    mask[i] = isSkin(data[o], data[o + 1], data[o + 2]) ? 1 : 0;
  }
  const blob = largestBlob(mask, w, h);
  if (!blob || blob.n < w * h * 0.02) return null;
  const sx = outW / w;
  const sy = outH / h;
  const x0 = blob.x0 * sx;
  const y0 = blob.y0 * sy;
  const bw = (blob.x1 - blob.x0) * sx;
  const bh = (blob.y1 - blob.y0) * sy;
  if (bh < 24 || bw < 20) return null;
  const leftEye = { x: x0 + bw * 0.32, y: y0 + bh * 0.38 };
  const rightEye = { x: x0 + bw * 0.68, y: y0 + bh * 0.38 };
  const chin = { x: x0 + bw * 0.5, y: y0 + bh * 0.96 };
  const forehead = { x: x0 + bw * 0.5, y: y0 + bh * 0.12 };
  const nose = { x: x0 + bw * 0.5, y: y0 + bh * 0.52 };
  const leftCheek = { x: x0 + bw * 0.06, y: y0 + bh * 0.48 };
  const rightCheek = { x: x0 + bw * 0.94, y: y0 + bh * 0.48 };
  const faceWidth = bw * 0.88;
  const faceHeight = bh * 0.84;
  const down = faceWidth * 0.42;
  return {
    leftEar: leftCheek,
    rightEar: rightCheek,
    leftLobe: { x: x0 + bw * 0.04, y: y0 + bh * 0.58 },
    rightLobe: { x: x0 + bw * 0.96, y: y0 + bh * 0.58 },
    forehead,
    glabella: { x: forehead.x, y: y0 + bh * 0.28 },
    chin,
    nose,
    leftEye,
    rightEye,
    leftCheek,
    rightCheek,
    mouth: { x: chin.x, y: y0 + bh * 0.78 },
    neckLeft: { x: leftCheek.x, y: chin.y + down * 0.5 },
    neckRight: { x: rightCheek.x, y: chin.y + down * 0.5 },
    neckDrop: { x: chin.x, y: chin.y + down * 1.05 },
    choker: { x: chin.x, y: chin.y + down * 0.36 },
    faceWidth,
    faceHeight,
    yaw: 0,
    pitch: 0,
    irisMmPerPx: 0,
  };
}

function sampleMetrics(ctx: CanvasRenderingContext2D, face: FaceAnchors): FaceMetrics | null {
  const pts = [face.leftCheek, face.rightCheek, lerp(face.nose, face.chin, 0.15)];
  let r = 0,
    g = 0,
    b = 0,
    n = 0;
  for (const p of pts) {
    const x = Math.max(0, Math.min(ctx.canvas.width - 2, p.x | 0));
    const y = Math.max(0, Math.min(ctx.canvas.height - 2, p.y | 0));
    const d = ctx.getImageData(x, y, 1, 1).data;
    r += d[0];
    g += d[1];
    b += d[2];
    n++;
  }
  if (!n) return null;
  const lab = rgbToLab(r / n, g / n, b / n);
  const jaw = dist(face.neckLeft, face.neckRight);
  const cheek = face.faceWidth;
  const foreheadW = dist(face.leftEar, face.rightEar) * 0.92;
  const ratios = {
    lengthOverWidth: face.faceHeight / Math.max(1, face.faceWidth),
    jawOverCheek: jaw / Math.max(1, cheek),
    foreheadOverCheek: foreheadW / Math.max(1, cheek),
  };
  return {
    ...ratios,
    shape: classifyFaceShape(ratios),
    undertone: classifyUndertone(lab),
    lab,
  };
}

function lightingFrom(ctx: CanvasRenderingContext2D, face: FaceAnchors | null): LightingInfo {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const x = face ? Math.max(0, (face.leftCheek.x | 0) - 4) : (w * 0.3) | 0;
  const y = face ? Math.max(0, (face.forehead.y | 0) - 4) : (h * 0.2) | 0;
  const rw = face ? Math.min(w - x, (face.faceWidth | 0) + 8) : (w * 0.4) | 0;
  const rh = face ? Math.min(h - y, (face.faceHeight | 0) + 8) : (h * 0.4) | 0;
  if (rw < 4 || rh < 4) return classifyLighting(0.5, 0.02);
  const step = Math.max(1, Math.round(Math.max(rw, rh) / 28));
  const img = ctx.getImageData(x, y, rw, rh).data;
  let sum = 0;
  let sum2 = 0;
  let n = 0;
  for (let yy = 0; yy < rh; yy += step) {
    for (let xx = 0; xx < rw; xx += step) {
      const i = (yy * rw + xx) * 4;
      const lum = (img[i] * 0.299 + img[i + 1] * 0.587 + img[i + 2] * 0.114) / 255;
      sum += lum;
      sum2 += lum * lum;
      n++;
    }
  }
  const mean = n ? sum / n : 0.5;
  const variance = n ? Math.max(0, sum2 / n - mean * mean) : 0;
  return classifyLighting(mean, variance);
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
}

export class AtelierVision {
  backend: VisionBackend = "heuristic";
  private faceLm: MpFace | null = null;
  private handLm: MpHand | null = null;
  private filters = new Map<string, VecFilter>();
  private lostFrames = 0;
  private proc = document.createElement("canvas");
  private procCtx = this.proc.getContext("2d", { willReadFrequently: true })!;
  private still: HTMLImageElement | null = null;
  private video: HTMLVideoElement | null = null;
  private lastStillKey = "";
  private stillFace: FaceAnchors | null = null;
  private stillHands: HandAnchors[] = [];
  ready = false;

  async init() {
    try {
      const mod = (await withTimeout(
        import(/* @vite-ignore */ `${VISION_CDN}/vision_bundle.mjs`),
        8000,
      )) as {
        FilesetResolver: { forVisionTasks: (p: string) => Promise<unknown> };
        FaceLandmarker: {
          createFromOptions: (fs: unknown, opts: unknown) => Promise<MpFace>;
        };
        HandLandmarker: {
          createFromOptions: (fs: unknown, opts: unknown) => Promise<MpHand>;
        };
      };
      const fileset = await withTimeout(mod.FilesetResolver.forVisionTasks(`${VISION_CDN}/wasm`), 8000);
      const [face, hand] = await Promise.all([
        mod.FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: FACE_MODEL, delegate: "GPU" },
          runningMode: "IMAGE",
          numFaces: 1,
        }).catch(() =>
          mod.FaceLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: FACE_MODEL, delegate: "CPU" },
            runningMode: "IMAGE",
            numFaces: 1,
          }),
        ),
        mod.HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: HAND_MODEL, delegate: "GPU" },
          runningMode: "IMAGE",
          numHands: 2,
        }).catch(() =>
          mod.HandLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: HAND_MODEL, delegate: "CPU" },
            runningMode: "IMAGE",
            numHands: 2,
          }),
        ),
      ]);
      this.faceLm = face;
      this.handLm = hand;
      this.backend = "mediapipe";
    } catch {
      this.backend = "heuristic";
    }
    this.ready = true;
  }

  setCamera(video: HTMLVideoElement | null) {
    this.video = video;
    this.still = null;
    this.resetFilters();
  }

  setStill(image: HTMLImageElement | null) {
    this.still = image;
    this.video = null;
    this.lastStillKey = "";
    this.resetFilters();
  }

  private resetFilters() {
    this.filters.forEach((f) => f.reset());
    this.lostFrames = 0;
  }

  private smoothFace(face: FaceAnchors, t: number): FaceAnchors {
    const keys: (keyof FaceAnchors)[] = [
      "leftEar",
      "rightEar",
      "leftLobe",
      "rightLobe",
      "forehead",
      "glabella",
      "chin",
      "nose",
      "leftEye",
      "rightEye",
      "leftCheek",
      "rightCheek",
      "mouth",
      "neckLeft",
      "neckRight",
      "neckDrop",
      "choker",
    ];
    const out = { ...face };
    for (const k of keys) {
      let f = this.filters.get(k);
      if (!f) {
        f = new VecFilter();
        this.filters.set(k, f);
      }
      (out[k] as Vec) = f.filter(face[k] as Vec, t);
    }
    out.faceWidth = dist(out.leftCheek, out.rightCheek);
    out.faceHeight = dist(out.forehead, out.chin);
    return out;
  }

  private drawSource(src: CanvasImageSource, sw: number, sh: number, mirror: boolean, dw: number, dh: number) {
    this.proc.width = dw;
    this.proc.height = dh;
    this.procCtx.save();
    if (mirror) {
      this.procCtx.translate(dw, 0);
      this.procCtx.scale(-1, 1);
    }
    this.procCtx.drawImage(src, 0, 0, sw, sh, 0, 0, dw, dh);
    this.procCtx.restore();
  }

  private detectOnProc(dw: number, dh: number): { face: FaceAnchors | null; hands: HandAnchors[] } {
    let face: FaceAnchors | null = null;
    let hands: HandAnchors[] = [];
    if (this.backend === "mediapipe" && this.faceLm) {
      try {
        const fr = this.faceLm.detect(this.proc);
        const raw = fr.faceLandmarks?.[0];
        if (raw?.length) face = faceFromLandmarks(raw, dw, dh);
        if (this.handLm) {
          const hr = this.handLm.detect(this.proc);
          const lms = hr.landmarks ?? [];
          hands = lms.map((list, i) => {
            const name = hr.handedness?.[i]?.[0]?.categoryName ?? "Unknown";
            return handFromLandmarks(list, name, dw, dh);
          });
        }
      } catch {
        face = heuristicFace(this.procCtx.getImageData(0, 0, dw, dh), dw, dh);
      }
    } else {
      face = heuristicFace(this.procCtx.getImageData(0, 0, dw, dh), dw, dh);
    }
    if (face && (face.faceWidth > dw * 0.92 || face.faceHeight > dh * 0.92 || face.faceWidth < 24)) {
      face = null;
    }
    return { face, hands };
  }

  tick(t: number, outW: number, outH: number): { result: FrameResult; frame: HTMLCanvasElement } {
    const video = this.video;
    const still = this.still;
    let tracking: TrackingState = "search";
    let face: FaceAnchors | null = null;
    let hands: HandAnchors[] = [];

    if (video && video.readyState >= 2 && video.videoWidth) {
      const dw = Math.min(480, video.videoWidth);
      const dh = Math.round((video.videoHeight / video.videoWidth) * dw);
      this.drawSource(video, video.videoWidth, video.videoHeight, true, dw, dh);
      const detected = this.detectOnProc(dw, dh);
      face = detected.face;
      hands = detected.hands;
    } else if (still && still.naturalWidth) {
      const dw = Math.min(480, still.naturalWidth);
      const dh = Math.round((still.naturalHeight / still.naturalWidth) * dw);
      this.drawSource(still, still.naturalWidth, still.naturalHeight, false, dw, dh);
      const key = `${still.src}:${dw}:${this.backend}`;
      if (this.lastStillKey !== key) {
        this.lastStillKey = key;
        const detected = this.detectOnProc(dw, dh);
        this.stillFace = detected.face;
        this.stillHands = detected.hands;
      }
      face = this.stillFace;
      hands = this.stillHands;
    }

    if (face) {
      face = this.smoothFace(face, t);
      this.lostFrames = 0;
      tracking = "lock";
    } else {
      this.lostFrames++;
      tracking = this.lostFrames > 12 ? "lost" : "search";
    }

    const lighting = lightingFrom(this.procCtx, face);
    let metrics: FaceMetrics | null = null;
    if (face) metrics = sampleMetrics(this.procCtx, face);

    const sx = outW / Math.max(1, this.proc.width);
    const sy = outH / Math.max(1, this.proc.height);
    const scaleVec = (v: Vec): Vec => ({ x: v.x * sx, y: v.y * sy });
    const scaleFace = (f: FaceAnchors): FaceAnchors => ({
      ...f,
      leftEar: scaleVec(f.leftEar),
      rightEar: scaleVec(f.rightEar),
      leftLobe: scaleVec(f.leftLobe),
      rightLobe: scaleVec(f.rightLobe),
      forehead: scaleVec(f.forehead),
      glabella: scaleVec(f.glabella),
      chin: scaleVec(f.chin),
      nose: scaleVec(f.nose),
      leftEye: scaleVec(f.leftEye),
      rightEye: scaleVec(f.rightEye),
      leftCheek: scaleVec(f.leftCheek),
      rightCheek: scaleVec(f.rightCheek),
      mouth: scaleVec(f.mouth),
      neckLeft: scaleVec(f.neckLeft),
      neckRight: scaleVec(f.neckRight),
      neckDrop: scaleVec(f.neckDrop),
      choker: scaleVec(f.choker),
      faceWidth: f.faceWidth * sx,
      faceHeight: f.faceHeight * sy,
    });
    const scaleHand = (hand: HandAnchors): HandAnchors => ({
      ...hand,
      wrist: scaleVec(hand.wrist),
      palm: scaleVec(hand.palm),
      fingers: {
        index: {
          ...hand.fingers.index,
          mcp: scaleVec(hand.fingers.index.mcp),
          pip: scaleVec(hand.fingers.index.pip),
          tip: scaleVec(hand.fingers.index.tip),
          width: hand.fingers.index.width * sx,
        },
        middle: {
          ...hand.fingers.middle,
          mcp: scaleVec(hand.fingers.middle.mcp),
          pip: scaleVec(hand.fingers.middle.pip),
          tip: scaleVec(hand.fingers.middle.tip),
          width: hand.fingers.middle.width * sx,
        },
        ring: {
          ...hand.fingers.ring,
          mcp: scaleVec(hand.fingers.ring.mcp),
          pip: scaleVec(hand.fingers.ring.pip),
          tip: scaleVec(hand.fingers.ring.tip),
          width: hand.fingers.ring.width * sx,
        },
        pinky: {
          ...hand.fingers.pinky,
          mcp: scaleVec(hand.fingers.pinky.mcp),
          pip: scaleVec(hand.fingers.pinky.pip),
          tip: scaleVec(hand.fingers.pinky.tip),
          width: hand.fingers.pinky.width * sx,
        },
      },
      bangle: {
        center: scaleVec(hand.bangle.center),
        rx: hand.bangle.rx * sx,
        ry: hand.bangle.ry * sy,
        angle: hand.bangle.angle,
      },
    });

    return {
      frame: this.proc,
      result: {
        face: face ? scaleFace(face) : null,
        metrics,
        hands: hands.map(scaleHand),
        lighting,
        tracking,
        backend: this.backend,
      },
    };
  }

  dispose() {
    try {
      this.faceLm?.close?.();
      this.handLm?.close?.();
    } catch {
      /* ignore */
    }
  }
}
