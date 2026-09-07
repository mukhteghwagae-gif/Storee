import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { C as Camera, E as Aperture, S as Download, a as Sparkles, d as ScanLine, i as Sun, m as PinOff, o as ShoppingBag, p as Pin, v as Image, x as FlipHorizontal } from "../_libs/lucide-react.mjs";
import { C as Button, _ as useStorefront, f as useSitara, m as formatPkr, o as Route$8 } from "./router-Cj9UCdm1.mjs";
import { a as classifyUndertone, c as lerp, d as mmPerPxFromFace, f as paletteFor, g as tryOnZoneFor, h as styleForProduct, i as classifyLighting, l as lookFromPiece, m as rgbToLab, n as buildIntelligence, o as dist, p as pieceCount, r as classifyFaceShape, s as isWorn, t as applyPiece, u as lookSlugs } from "./intelligence-wVEiNvGR.mjs";
import { t as trackEvent } from "./analytics-BrWCqjct.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/try-on-AR4NnL2G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** One Euro Filter — low-lag smoothing used in production AR (Casiez et al.). */
var OneEuro = class {
	minCutoff;
	beta;
	dcutoff;
	xPrev;
	dxPrev = 0;
	tPrev;
	constructor(minCutoff = 1.2, beta = .007, dcutoff = 1) {
		this.minCutoff = minCutoff;
		this.beta = beta;
		this.dcutoff = dcutoff;
	}
	reset() {
		this.xPrev = void 0;
		this.dxPrev = 0;
		this.tPrev = void 0;
	}
	filter(x, t) {
		if (this.tPrev === void 0 || this.xPrev === void 0) {
			this.tPrev = t;
			this.xPrev = x;
			return x;
		}
		const dt = Math.max(.001, (t - this.tPrev) / 1e3);
		const dx = (x - this.xPrev) / dt;
		const edx = expSmooth(this.dxPrev, dx, alpha(dt, this.dcutoff));
		const cutoff = this.minCutoff + this.beta * Math.abs(edx);
		const xOut = expSmooth(this.xPrev, x, alpha(dt, cutoff));
		this.tPrev = t;
		this.xPrev = xOut;
		this.dxPrev = edx;
		return xOut;
	}
};
function alpha(dt, cutoff) {
	return 1 / (1 + 1 / (2 * Math.PI * cutoff) / dt);
}
function expSmooth(prev, next, a) {
	return a * next + (1 - a) * prev;
}
var VecFilter = class {
	x = new OneEuro();
	y = new OneEuro();
	filter(pt, t) {
		return {
			x: this.x.filter(pt.x, t),
			y: this.y.filter(pt.y, t)
		};
	}
	reset() {
		this.x.reset();
		this.y.reset();
	}
};
var VISION_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18";
var FACE_MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
var HAND_MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
function lm(list, i) {
	const p = list[i] ?? {
		x: .5,
		y: .5
	};
	return {
		x: p.x,
		y: p.y
	};
}
function toPx(p, w, h) {
	return {
		x: p.x * w,
		y: p.y * h
	};
}
function faceFromLandmarks(list, w, h) {
	const L = (i) => toPx(lm(list, i), w, h);
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
	const eyeMid = lerp(leftEye, rightEye, .5);
	const pitch = faceHeight > 1 ? (nose.y - eyeMid.y) / faceHeight : 0;
	const iris = list[468] && list[473] ? dist(L(468), L(469) ?? L(468)) : 0;
	const down = faceWidth * .42;
	return {
		leftEar: leftCheek,
		rightEar: rightCheek,
		leftLobe: {
			x: leftLobe.x,
			y: leftLobe.y + faceHeight * .04
		},
		rightLobe: {
			x: rightLobe.x,
			y: rightLobe.y + faceHeight * .04
		},
		forehead,
		glabella: L(9),
		chin,
		nose,
		leftEye,
		rightEye,
		leftCheek,
		rightCheek,
		mouth: L(13),
		neckLeft: {
			x: leftCheek.x - faceWidth * .02,
			y: chin.y + down * .55
		},
		neckRight: {
			x: rightCheek.x + faceWidth * .02,
			y: chin.y + down * .55
		},
		neckDrop: {
			x: chin.x,
			y: chin.y + down * 1.05
		},
		choker: {
			x: chin.x,
			y: chin.y + down * .38
		},
		faceWidth,
		faceHeight,
		yaw,
		pitch,
		irisMmPerPx: iris > 2 ? 11.7 / iris : 0
	};
}
function handFromLandmarks(list, handedness, w, h) {
	const P = (i) => toPx(lm(list, i), w, h);
	const finger = (mcp, pip, tip) => {
		const a = P(mcp);
		const b = P(pip);
		return {
			mcp: a,
			pip: b,
			tip: P(tip),
			width: dist(a, b) * .38,
			angle: Math.atan2(b.y - a.y, b.x - a.x)
		};
	};
	const wrist = P(0);
	const middleMcp = P(9);
	const thumb = P(1);
	const palm = lerp(wrist, middleMcp, .45);
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
			pinky: finger(17, 18, 20)
		},
		bangle: {
			center: lerp(wrist, middleMcp, .12),
			rx: span,
			ry: span * .42,
			angle: axis + Math.PI / 2
		}
	};
}
function isSkin(r, g, b) {
	const y = .299 * r + .587 * g + .114 * b;
	const cb = 128 - .168736 * r - .331264 * g + .5 * b;
	const cr = 128 + .5 * r - .418688 * g - .081312 * b;
	return y > 40 && y < 245 && cb > 77 && cb < 135 && cr > 130 && cr < 180 && r > g - 10 && r > 60;
}
function largestBlob(mask, w, h) {
	const seen = new Uint8Array(w * h);
	let best = null;
	const qx = [];
	const qy = [];
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const i = y * w + x;
		if (!mask[i] || seen[i]) continue;
		qx.length = 0;
		qy.length = 0;
		qx.push(x);
		qy.push(y);
		seen[i] = 1;
		let n = 0;
		let x0 = x, y0 = y, x1 = x, y1 = y;
		while (qx.length) {
			const cx = qx.pop();
			const cy = qy.pop();
			n++;
			if (cx < x0) x0 = cx;
			if (cy < y0) y0 = cy;
			if (cx > x1) x1 = cx;
			if (cy > y1) y1 = cy;
			for (const [dx, dy] of [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1]
			]) {
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
		if (!best || n > best.n) best = {
			x0,
			y0,
			x1,
			y1,
			n
		};
	}
	return best;
}
function heuristicFace(imageData, outW, outH) {
	const { width: w, height: h, data } = imageData;
	const mask = new Uint8Array(w * h);
	for (let i = 0; i < w * h; i++) {
		const o = i * 4;
		mask[i] = isSkin(data[o], data[o + 1], data[o + 2]) ? 1 : 0;
	}
	const blob = largestBlob(mask, w, h);
	if (!blob || blob.n < w * h * .02) return null;
	const sx = outW / w;
	const sy = outH / h;
	const x0 = blob.x0 * sx;
	const y0 = blob.y0 * sy;
	const bw = (blob.x1 - blob.x0) * sx;
	const bh = (blob.y1 - blob.y0) * sy;
	if (bh < 24 || bw < 20) return null;
	const leftEye = {
		x: x0 + bw * .32,
		y: y0 + bh * .38
	};
	const rightEye = {
		x: x0 + bw * .68,
		y: y0 + bh * .38
	};
	const chin = {
		x: x0 + bw * .5,
		y: y0 + bh * .96
	};
	const forehead = {
		x: x0 + bw * .5,
		y: y0 + bh * .12
	};
	const nose = {
		x: x0 + bw * .5,
		y: y0 + bh * .52
	};
	const leftCheek = {
		x: x0 + bw * .06,
		y: y0 + bh * .48
	};
	const rightCheek = {
		x: x0 + bw * .94,
		y: y0 + bh * .48
	};
	const faceWidth = bw * .88;
	const faceHeight = bh * .84;
	const down = faceWidth * .42;
	return {
		leftEar: leftCheek,
		rightEar: rightCheek,
		leftLobe: {
			x: x0 + bw * .04,
			y: y0 + bh * .58
		},
		rightLobe: {
			x: x0 + bw * .96,
			y: y0 + bh * .58
		},
		forehead,
		glabella: {
			x: forehead.x,
			y: y0 + bh * .28
		},
		chin,
		nose,
		leftEye,
		rightEye,
		leftCheek,
		rightCheek,
		mouth: {
			x: chin.x,
			y: y0 + bh * .78
		},
		neckLeft: {
			x: leftCheek.x,
			y: chin.y + down * .5
		},
		neckRight: {
			x: rightCheek.x,
			y: chin.y + down * .5
		},
		neckDrop: {
			x: chin.x,
			y: chin.y + down * 1.05
		},
		choker: {
			x: chin.x,
			y: chin.y + down * .36
		},
		faceWidth,
		faceHeight,
		yaw: 0,
		pitch: 0,
		irisMmPerPx: 0
	};
}
function sampleMetrics(ctx, face) {
	const pts = [
		face.leftCheek,
		face.rightCheek,
		lerp(face.nose, face.chin, .15)
	];
	let r = 0, g = 0, b = 0, n = 0;
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
	const foreheadW = dist(face.leftEar, face.rightEar) * .92;
	const ratios = {
		lengthOverWidth: face.faceHeight / Math.max(1, face.faceWidth),
		jawOverCheek: jaw / Math.max(1, cheek),
		foreheadOverCheek: foreheadW / Math.max(1, cheek)
	};
	return {
		...ratios,
		shape: classifyFaceShape(ratios),
		undertone: classifyUndertone(lab),
		lab
	};
}
function lightingFrom(ctx, face) {
	const w = ctx.canvas.width;
	const h = ctx.canvas.height;
	const x = face ? Math.max(0, (face.leftCheek.x | 0) - 4) : w * .3 | 0;
	const y = face ? Math.max(0, (face.forehead.y | 0) - 4) : h * .2 | 0;
	const rw = face ? Math.min(w - x, (face.faceWidth | 0) + 8) : w * .4 | 0;
	const rh = face ? Math.min(h - y, (face.faceHeight | 0) + 8) : h * .4 | 0;
	if (rw < 4 || rh < 4) return classifyLighting(.5, .02);
	const step = Math.max(1, Math.round(Math.max(rw, rh) / 28));
	const img = ctx.getImageData(x, y, rw, rh).data;
	let sum = 0;
	let sum2 = 0;
	let n = 0;
	for (let yy = 0; yy < rh; yy += step) for (let xx = 0; xx < rw; xx += step) {
		const i = (yy * rw + xx) * 4;
		const lum = (img[i] * .299 + img[i + 1] * .587 + img[i + 2] * .114) / 255;
		sum += lum;
		sum2 += lum * lum;
		n++;
	}
	const mean = n ? sum / n : .5;
	const variance = n ? Math.max(0, sum2 / n - mean * mean) : 0;
	return classifyLighting(mean, variance);
}
async function withTimeout(p, ms) {
	return await Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(/* @__PURE__ */ new Error("timeout")), ms))]);
}
var AtelierVision = class {
	backend = "heuristic";
	faceLm = null;
	handLm = null;
	filters = /* @__PURE__ */ new Map();
	lostFrames = 0;
	proc = document.createElement("canvas");
	procCtx = this.proc.getContext("2d", { willReadFrequently: true });
	still = null;
	video = null;
	lastStillKey = "";
	stillFace = null;
	stillHands = [];
	ready = false;
	async init() {
		try {
			const mod = await withTimeout(import(
				/* @vite-ignore */
				`${VISION_CDN}/vision_bundle.mjs`
), 8e3);
			const fileset = await withTimeout(mod.FilesetResolver.forVisionTasks(`${VISION_CDN}/wasm`), 8e3);
			const [face, hand] = await Promise.all([mod.FaceLandmarker.createFromOptions(fileset, {
				baseOptions: {
					modelAssetPath: FACE_MODEL,
					delegate: "GPU"
				},
				runningMode: "IMAGE",
				numFaces: 1
			}).catch(() => mod.FaceLandmarker.createFromOptions(fileset, {
				baseOptions: {
					modelAssetPath: FACE_MODEL,
					delegate: "CPU"
				},
				runningMode: "IMAGE",
				numFaces: 1
			})), mod.HandLandmarker.createFromOptions(fileset, {
				baseOptions: {
					modelAssetPath: HAND_MODEL,
					delegate: "GPU"
				},
				runningMode: "IMAGE",
				numHands: 2
			}).catch(() => mod.HandLandmarker.createFromOptions(fileset, {
				baseOptions: {
					modelAssetPath: HAND_MODEL,
					delegate: "CPU"
				},
				runningMode: "IMAGE",
				numHands: 2
			}))]);
			this.faceLm = face;
			this.handLm = hand;
			this.backend = "mediapipe";
		} catch {
			this.backend = "heuristic";
		}
		this.ready = true;
	}
	setCamera(video) {
		this.video = video;
		this.still = null;
		this.resetFilters();
	}
	setStill(image) {
		this.still = image;
		this.video = null;
		this.lastStillKey = "";
		this.resetFilters();
	}
	resetFilters() {
		this.filters.forEach((f) => f.reset());
		this.lostFrames = 0;
	}
	smoothFace(face, t) {
		const keys = [
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
			"choker"
		];
		const out = { ...face };
		for (const k of keys) {
			let f = this.filters.get(k);
			if (!f) {
				f = new VecFilter();
				this.filters.set(k, f);
			}
			out[k] = f.filter(face[k], t);
		}
		out.faceWidth = dist(out.leftCheek, out.rightCheek);
		out.faceHeight = dist(out.forehead, out.chin);
		return out;
	}
	drawSource(src, sw, sh, mirror, dw, dh) {
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
	detectOnProc(dw, dh) {
		let face = null;
		let hands = [];
		if (this.backend === "mediapipe" && this.faceLm) try {
			const raw = this.faceLm.detect(this.proc).faceLandmarks?.[0];
			if (raw?.length) face = faceFromLandmarks(raw, dw, dh);
			if (this.handLm) {
				const hr = this.handLm.detect(this.proc);
				hands = (hr.landmarks ?? []).map((list, i) => {
					return handFromLandmarks(list, hr.handedness?.[i]?.[0]?.categoryName ?? "Unknown", dw, dh);
				});
			}
		} catch {
			face = heuristicFace(this.procCtx.getImageData(0, 0, dw, dh), dw, dh);
		}
		else face = heuristicFace(this.procCtx.getImageData(0, 0, dw, dh), dw, dh);
		if (face && (face.faceWidth > dw * .92 || face.faceHeight > dh * .92 || face.faceWidth < 24)) face = null;
		return {
			face,
			hands
		};
	}
	tick(t, outW, outH) {
		const video = this.video;
		const still = this.still;
		let tracking = "search";
		let face = null;
		let hands = [];
		if (video && video.readyState >= 2 && video.videoWidth) {
			const dw = Math.min(480, video.videoWidth);
			const dh = Math.round(video.videoHeight / video.videoWidth * dw);
			this.drawSource(video, video.videoWidth, video.videoHeight, true, dw, dh);
			const detected = this.detectOnProc(dw, dh);
			face = detected.face;
			hands = detected.hands;
		} else if (still && still.naturalWidth) {
			const dw = Math.min(480, still.naturalWidth);
			const dh = Math.round(still.naturalHeight / still.naturalWidth * dw);
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
		let metrics = null;
		if (face) metrics = sampleMetrics(this.procCtx, face);
		const sx = outW / Math.max(1, this.proc.width);
		const sy = outH / Math.max(1, this.proc.height);
		const scaleVec = (v) => ({
			x: v.x * sx,
			y: v.y * sy
		});
		const scaleFace = (f) => ({
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
			faceHeight: f.faceHeight * sy
		});
		const scaleHand = (hand) => ({
			...hand,
			wrist: scaleVec(hand.wrist),
			palm: scaleVec(hand.palm),
			fingers: {
				index: {
					...hand.fingers.index,
					mcp: scaleVec(hand.fingers.index.mcp),
					pip: scaleVec(hand.fingers.index.pip),
					tip: scaleVec(hand.fingers.index.tip),
					width: hand.fingers.index.width * sx
				},
				middle: {
					...hand.fingers.middle,
					mcp: scaleVec(hand.fingers.middle.mcp),
					pip: scaleVec(hand.fingers.middle.pip),
					tip: scaleVec(hand.fingers.middle.tip),
					width: hand.fingers.middle.width * sx
				},
				ring: {
					...hand.fingers.ring,
					mcp: scaleVec(hand.fingers.ring.mcp),
					pip: scaleVec(hand.fingers.ring.pip),
					tip: scaleVec(hand.fingers.ring.tip),
					width: hand.fingers.ring.width * sx
				},
				pinky: {
					...hand.fingers.pinky,
					mcp: scaleVec(hand.fingers.pinky.mcp),
					pip: scaleVec(hand.fingers.pinky.pip),
					tip: scaleVec(hand.fingers.pinky.tip),
					width: hand.fingers.pinky.width * sx
				}
			},
			bangle: {
				center: scaleVec(hand.bangle.center),
				rx: hand.bangle.rx * sx,
				ry: hand.bangle.ry * sy,
				angle: hand.bangle.angle
			}
		});
		return {
			frame: this.proc,
			result: {
				face: face ? scaleFace(face) : null,
				metrics,
				hands: hands.map(scaleHand),
				lighting,
				tracking,
				backend: this.backend
			}
		};
	}
	dispose() {
		try {
			this.faceLm?.close?.();
			this.handLm?.close?.();
		} catch {}
	}
};
function spark(ctx, x, y, s, a) {
	ctx.save();
	ctx.globalAlpha = a;
	ctx.strokeStyle = "#fff";
	ctx.lineWidth = Math.max(.8, s * .12);
	ctx.beginPath();
	ctx.moveTo(x - s, y);
	ctx.lineTo(x + s, y);
	ctx.moveTo(x, y - s);
	ctx.lineTo(x, y + s);
	ctx.stroke();
	ctx.restore();
}
function goldFill(ctx, pal, x, y, r) {
	const g = ctx.createRadialGradient(x - r * .35, y - r * .4, r * .05, x, y, r);
	g.addColorStop(0, pal.hi);
	g.addColorStop(.35, pal.a);
	g.addColorStop(.75, pal.b);
	g.addColorStop(1, pal.c);
	return g;
}
function metalStroke(ctx, pal, x0, y0, x1, y1) {
	const g = ctx.createLinearGradient(x0, y0, x1, y1);
	g.addColorStop(0, pal.hi);
	g.addColorStop(.25, pal.a);
	g.addColorStop(.5, pal.c);
	g.addColorStop(.75, pal.b);
	g.addColorStop(1, pal.hi);
	return g;
}
function shadow(ctx, x, y, rx, ry) {
	ctx.save();
	ctx.fillStyle = "rgba(28,24,20,0.22)";
	ctx.beginPath();
	ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function pearl(ctx, x, y, r) {
	const g = ctx.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r);
	g.addColorStop(0, "#fffaf4");
	g.addColorStop(.45, "#f4eee4");
	g.addColorStop(.8, "#e8d6cc");
	g.addColorStop(1, "#c4a36a");
	ctx.fillStyle = g;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(255,255,255,0.7)";
	ctx.beginPath();
	ctx.arc(x - r * .28, y - r * .3, r * .18, 0, Math.PI * 2);
	ctx.fill();
}
function gem(ctx, x, y, r, color, cut) {
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = color;
	ctx.strokeStyle = "rgba(255,255,255,0.55)";
	ctx.lineWidth = Math.max(.6, r * .08);
	ctx.beginPath();
	if (cut === "baguette") ctx.rect(-r * .35, -r * .9, r * .7, r * 1.8);
	else if (cut === "oval") ctx.ellipse(0, 0, r * .7, r, 0, 0, Math.PI * 2);
	else {
		ctx.moveTo(0, -r);
		ctx.lineTo(r * .7, 0);
		ctx.lineTo(0, r);
		ctx.lineTo(-r * .7, 0);
		ctx.closePath();
	}
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "rgba(255,255,255,0.45)";
	ctx.beginPath();
	ctx.ellipse(-r * .18, -r * .25, r * .18, r * .12, -.4, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function drawJhumka(w, x, y, s, pal) {
	const { ctx, time, sparkle } = w;
	shadow(ctx, x, y + s * 1.55, s * .42, s * .1);
	ctx.strokeStyle = metalStroke(ctx, pal, x - s, y, x + s, y + s * 2);
	ctx.lineWidth = Math.max(1.2, s * .08);
	ctx.beginPath();
	ctx.arc(x, y, s * .22, Math.PI * .15, Math.PI * .85);
	ctx.stroke();
	ctx.fillStyle = goldFill(ctx, pal, x, y + s * .45, s * .55);
	ctx.beginPath();
	ctx.ellipse(x, y + s * .42, s * .48, s * .28, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(x - s * .42, y + s * .55);
	ctx.quadraticCurveTo(x, y + s * 1.45, x + s * .42, y + s * .55);
	ctx.closePath();
	ctx.fill();
	ctx.strokeStyle = pal.c;
	ctx.lineWidth = Math.max(.6, s * .04);
	for (let i = -2; i <= 2; i++) {
		ctx.beginPath();
		ctx.moveTo(x + i * s * .12, y + s * .58);
		ctx.quadraticCurveTo(x + i * s * .08, y + s * 1.05, x, y + s * 1.28);
		ctx.stroke();
	}
	pearl(ctx, x, y + s * 1.42, s * .16);
	const tw = w.reducedMotion ? .7 : .45 + .55 * Math.abs(Math.sin(time * .004 + x));
	spark(ctx, x + s * .2, y + s * .3, s * .12, sparkle * tw);
}
function drawHoop(w, x, y, s, pal) {
	const { ctx, time, sparkle } = w;
	ctx.strokeStyle = metalStroke(ctx, pal, x - s, y - s, x + s, y + s);
	ctx.lineWidth = Math.max(2, s * .22);
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.arc(x, y + s * .15, s * .72, 0, Math.PI * 2);
	ctx.stroke();
	ctx.strokeStyle = pal.hi;
	ctx.globalAlpha = .55;
	ctx.lineWidth = Math.max(1, s * .06);
	ctx.beginPath();
	ctx.arc(x, y + s * .15, s * .72, -.8, .4);
	ctx.stroke();
	ctx.globalAlpha = 1;
	const tw = w.reducedMotion ? .5 : .4 + .6 * Math.abs(Math.sin(time * .005 + y));
	spark(ctx, x + s * .45, y - s * .2, s * .1, sparkle * tw);
}
function drawPearlStud(w, x, y, s, pal) {
	const { ctx } = w;
	ctx.fillStyle = goldFill(ctx, pal, x, y, s * .28);
	ctx.beginPath();
	ctx.arc(x, y, s * .22, 0, Math.PI * 2);
	ctx.fill();
	pearl(ctx, x, y, s * .42);
}
function drawTeardrop(w, x, y, s, pal) {
	const { ctx, sparkle, time } = w;
	ctx.fillStyle = goldFill(ctx, pal, x, y, s * .3);
	ctx.beginPath();
	ctx.arc(x, y, s * .16, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = pal.b;
	ctx.lineWidth = Math.max(1, s * .06);
	ctx.beginPath();
	ctx.moveTo(x, y + s * .16);
	ctx.lineTo(x, y + s * .38);
	ctx.stroke();
	gem(ctx, x, y + s * .85, s * .42, pal.gem, "oval");
	ctx.strokeStyle = pal.a;
	ctx.lineWidth = Math.max(1, s * .07);
	ctx.beginPath();
	ctx.ellipse(x, y + s * .85, s * .55, s * .72, 0, 0, Math.PI * 2);
	ctx.stroke();
	spark(ctx, x + s * .18, y + s * .62, s * .12, sparkle * (.5 + .5 * Math.sin(time * .006)));
}
function drawBand(w, x, y, s, pal, angle, kind) {
	const { ctx, sparkle, time } = w;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(angle);
	const rx = s * (kind === "cocktail" ? 1.15 : .95);
	const ry = s * .38;
	shadow(ctx, 0, s * .35, rx * .9, ry * .45);
	ctx.strokeStyle = metalStroke(ctx, pal, -rx, 0, rx, 0);
	ctx.lineWidth = kind === "thin" ? Math.max(1.6, s * .22) : Math.max(2.2, s * .32);
	ctx.beginPath();
	ctx.ellipse(0, 0, rx, ry, 0, .15, Math.PI - .15);
	ctx.stroke();
	ctx.strokeStyle = pal.hi;
	ctx.globalAlpha = .5;
	ctx.lineWidth = Math.max(.8, s * .08);
	ctx.beginPath();
	ctx.ellipse(0, 0, rx, ry, 0, .4, 1.2);
	ctx.stroke();
	ctx.globalAlpha = 1;
	if (kind === "thin") gem(ctx, 0, -ry * .2, s * .22, pal.gem, "baguette");
	if (kind === "solitaire") gem(ctx, 0, -ry * .35, s * .42, pal.gem, "round");
	if (kind === "cocktail") gem(ctx, 0, -ry * .2, s * .7, pal.gem, "oval");
	spark(ctx, s * .15, -s * .35, s * .1, sparkle * (.5 + .5 * Math.sin(time * .007)));
	ctx.restore();
}
function chainPoints(left, right, drop, n) {
	const pts = [];
	for (let i = 0; i <= n; i++) {
		const t = i / n;
		const u = 1 - t;
		pts.push({
			x: u * u * left.x + 2 * u * t * drop.x + t * t * right.x,
			y: u * u * left.y + 2 * u * t * drop.y + t * t * right.y
		});
	}
	return pts;
}
function drawLinks(ctx, pts, pal, w, kind) {
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
function drawNecklace(w, left, right, drop, pal, style) {
	const { ctx, sparkle, time } = w;
	const width = Math.hypot(right.x - left.x, right.y - left.y);
	if (style === "layered-rose") {
		for (const k of [
			.7,
			1,
			1.28
		]) drawLinks(ctx, chainPoints(left, right, {
			x: drop.x,
			y: left.y + (drop.y - left.y) * k
		}, 18), pal, Math.max(1.2, width * .012), "paperclip");
		return;
	}
	const pts = chainPoints(left, right, drop, style.startsWith("choker") || style === "bridal-haar" ? 22 : 16);
	drawLinks(ctx, pts, pal, Math.max(1.3, width * (style === "figaro" ? .022 : .014)), style === "figaro" ? "figaro" : "paperclip");
	const mid = pts[Math.floor(pts.length / 2)];
	if (style === "choker-kundan" || style === "bridal-haar") {
		const count = style === "bridal-haar" ? 7 : 5;
		for (let i = 0; i < count; i++) {
			const p = pts[Math.round((i + 1) / (count + 1) * (pts.length - 1))];
			ctx.fillStyle = goldFill(ctx, pal, p.x, p.y, width * .04);
			ctx.beginPath();
			ctx.ellipse(p.x, p.y + width * .02, width * .028, width * .038, 0, 0, Math.PI * 2);
			ctx.fill();
			gem(ctx, p.x, p.y + width * .02, width * .016, pal.gem, "round");
		}
	}
	if (style === "choker-moon") for (const p of [
		pts[6],
		mid,
		pts[pts.length - 7]
	]) pearl(ctx, p.x, p.y + width * .012, width * .022);
	if (style === "bridal-haar") gem(ctx, mid.x, mid.y + width * .06, width * .04, pal.gem, "oval");
	spark(ctx, mid.x + 4, mid.y, width * .012, sparkle * (.4 + .6 * Math.abs(Math.sin(time * .004))));
}
function drawTikka(w, hairline, pendant, pal) {
	const { ctx, sparkle, time } = w;
	const s = Math.hypot(pendant.x - hairline.x, pendant.y - hairline.y) || 24;
	ctx.strokeStyle = metalStroke(ctx, pal, hairline.x, hairline.y, pendant.x, pendant.y);
	ctx.lineWidth = Math.max(1.2, s * .06);
	ctx.beginPath();
	ctx.moveTo(hairline.x, hairline.y);
	ctx.quadraticCurveTo(hairline.x, (hairline.y + pendant.y) / 2, pendant.x, pendant.y);
	ctx.stroke();
	ctx.fillStyle = goldFill(ctx, pal, pendant.x, pendant.y, s * .28);
	ctx.beginPath();
	ctx.arc(pendant.x, pendant.y, s * .22, 0, Math.PI * 2);
	ctx.fill();
	gem(ctx, pendant.x, pendant.y, s * .16, pal.gem, "round");
	pearl(ctx, pendant.x, pendant.y + s * .32, s * .08);
	spark(ctx, pendant.x + s * .12, pendant.y - s * .1, s * .08, sparkle * (.5 + .5 * Math.sin(time * .005)));
}
function drawBangle(w, c, rx, ry, angle, pal, thick) {
	const { ctx, sparkle, time } = w;
	ctx.save();
	ctx.translate(c.x, c.y);
	ctx.rotate(angle);
	ctx.strokeStyle = metalStroke(ctx, pal, -rx, 0, rx, 0);
	ctx.lineWidth = thick ? Math.max(3, rx * .16) : Math.max(2, rx * .08);
	ctx.beginPath();
	ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
	ctx.stroke();
	if (thick) {
		ctx.strokeStyle = pal.c;
		ctx.globalAlpha = .45;
		ctx.lineWidth = 1;
		for (let i = 0; i < 10; i++) {
			const a = i / 10 * Math.PI * 2;
			ctx.beginPath();
			ctx.arc(Math.cos(a) * rx * .92, Math.sin(a) * ry * .92, rx * .04, 0, Math.PI * 2);
			ctx.stroke();
		}
		ctx.globalAlpha = 1;
	}
	spark(ctx, rx * .55, -ry * .2, rx * .06, sparkle * (.4 + .6 * Math.sin(time * .005)));
	ctx.restore();
}
function drawTennis(w, c, rx, ry, angle, pal) {
	const { ctx } = w;
	ctx.save();
	ctx.translate(c.x, c.y);
	ctx.rotate(angle);
	const n = 16;
	for (let i = 0; i < n; i++) {
		const a = i / n * Math.PI * 2;
		gem(ctx, Math.cos(a) * rx, Math.sin(a) * ry, Math.max(2.2, rx * .07), pal.gem, "round");
	}
	ctx.restore();
}
function drawStyle(w, style, pal, at) {
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
			if (at.hairline) drawTikka(w, at.hairline, {
				x: at.x,
				y: at.y
			}, pal);
			break;
		case "slim-bangle":
			drawBangle(w, {
				x: at.x,
				y: at.y
			}, s, s * .42, at.rotation, pal, false);
			break;
		case "kangan":
			drawBangle(w, {
				x: at.x,
				y: at.y
			}, s, s * .46, at.rotation, pal, true);
			break;
		case "tennis":
			drawTennis(w, {
				x: at.x,
				y: at.y
			}, s, s * .4, at.rotation, pal);
			break;
		default: if (at.left && at.right && at.drop) drawNecklace(w, at.left, at.right, at.drop, pal, style);
	}
}
function drawProduct(w, product, placements) {
	const pal = paletteFor(product);
	const style = styleForProduct(product);
	for (const at of placements) drawStyle(w, style, pal, at);
}
function drawVignette(ctx, w, h) {
	const g = ctx.createRadialGradient(w / 2, h * .42, h * .2, w / 2, h * .5, h * .78);
	g.addColorStop(0, "rgba(28,24,20,0)");
	g.addColorStop(1, "rgba(28,24,20,0.38)");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
}
function drawScan(ctx, w, h, t) {
	const y = t * .08 % (h + 80) - 40;
	const g = ctx.createLinearGradient(0, y - 30, 0, y + 30);
	g.addColorStop(0, "rgba(196,163,106,0)");
	g.addColorStop(.5, "rgba(196,163,106,0.28)");
	g.addColorStop(1, "rgba(196,163,106,0)");
	ctx.fillStyle = g;
	ctx.fillRect(0, y - 30, w, 60);
}
function drawWatermark(ctx, w, h) {
	ctx.save();
	ctx.fillStyle = "rgba(244,238,228,0.78)";
	ctx.font = `500 ${Math.max(14, w * .028)}px "Cormorant Garamond", serif`;
	ctx.textAlign = "right";
	ctx.fillText("Sitara", w - 18, h - 22);
	ctx.restore();
}
function withNudge(p, n, w, h) {
	return {
		...p,
		x: p.x + n.x / 100 * w,
		y: p.y + n.y / 100 * h
	};
}
function placementsFor(product, face, hands, canvas, look, nudge) {
	const style = styleForProduct(product);
	const w = canvas.w;
	const h = canvas.h;
	const n = (p) => withNudge(p, nudge, w, h);
	if (style === "jhumka" || style === "hoop" || style === "pearl-stud" || style === "teardrop") {
		const fw = face?.faceWidth ?? w * .28;
		const scale = style === "jhumka" ? fw * .18 : style === "teardrop" ? fw * .16 : style === "hoop" ? fw * .14 : fw * .08;
		const left = face?.leftLobe ?? {
			x: w * .28,
			y: h * .42
		};
		const right = face?.rightLobe ?? {
			x: w * .72,
			y: h * .42
		};
		const yaw = face?.yaw ?? 0;
		const out = [];
		if (yaw < .32) out.push(n({
			x: left.x,
			y: left.y,
			scale,
			rotation: 0
		}));
		if (yaw > -.32) out.push(n({
			x: right.x,
			y: right.y,
			scale,
			rotation: 0
		}));
		return out;
	}
	if (style === "tikka") {
		const hairline = face?.forehead ?? {
			x: w * .5,
			y: h * .18
		};
		const pendant = face?.glabella ?? {
			x: w * .5,
			y: h * .28
		};
		return [n({
			x: pendant.x,
			y: pendant.y,
			scale: (face?.faceHeight ?? h * .4) * .12,
			rotation: 0,
			hairline
		})];
	}
	if (style === "paperclip" || style === "figaro" || style === "choker-kundan" || style === "choker-moon" || style === "layered-rose" || style === "bridal-haar") {
		const choker = style.startsWith("choker");
		const left = face?.neckLeft ?? {
			x: w * .32,
			y: h * .62
		};
		const right = face?.neckRight ?? {
			x: w * .68,
			y: h * .62
		};
		const drop = choker ? face?.choker ?? {
			x: w * .5,
			y: h * .58
		} : style === "bridal-haar" ? face?.neckDrop ?? {
			x: w * .5,
			y: h * .72
		} : lerp(face?.choker ?? {
			x: w * .5,
			y: h * .58
		}, face?.neckDrop ?? {
			x: w * .5,
			y: h * .7
		}, .55);
		return [n({
			x: drop.x,
			y: drop.y,
			scale: face?.faceWidth ?? w * .3,
			rotation: 0,
			left,
			right,
			drop
		})];
	}
	if (style === "thin-band" || style === "cocktail" || style === "solitaire") {
		const finger = look.rings.find((r) => r.slug === product.slug)?.finger ?? "ring";
		const hand = hands[0];
		if (hand) {
			const f = hand.fingers[finger];
			const at = lerp(f.mcp, f.pip, .32);
			return [n({
				x: at.x,
				y: at.y,
				scale: Math.max(10, f.width * 1.6),
				rotation: f.angle + Math.PI / 2
			})];
		}
		return [n({
			x: w * .58,
			y: h * .72,
			scale: w * .06,
			rotation: -.4
		})];
	}
	if (style === "slim-bangle" || style === "kangan" || style === "tennis") {
		const hand = hands[0];
		const idx = look.wrist.indexOf(product.slug);
		const offset = (idx < 0 ? 0 : idx) * .18;
		if (hand) {
			const c = {
				x: hand.bangle.center.x + Math.cos(hand.bangle.angle) * hand.bangle.rx * offset,
				y: hand.bangle.center.y + Math.sin(hand.bangle.angle) * hand.bangle.ry * offset
			};
			return [n({
				x: c.x,
				y: c.y,
				scale: hand.bangle.rx * (style === "kangan" ? 1.05 : .95),
				rotation: hand.bangle.angle
			})];
		}
		return [n({
			x: w * .55,
			y: h * .78,
			scale: w * .12,
			rotation: .2
		})];
	}
	return [];
}
var ZONES = [
	{
		id: "all",
		label: "The look"
	},
	{
		id: "ear",
		label: "Ears"
	},
	{
		id: "neck",
		label: "Neck"
	},
	{
		id: "forehead",
		label: "Tikka"
	},
	{
		id: "hand",
		label: "Rings"
	},
	{
		id: "wrist",
		label: "Wrist"
	}
];
var PORTRAITS = [
	{
		src: "/editorial/everyday.jpg",
		label: "Neck"
	},
	{
		src: "/editorial/bridal.jpg",
		label: "Hand"
	},
	{
		src: "/editorial/hero.jpg",
		label: "Atelier"
	}
];
function AtelierStudio({ initialSlug }) {
	const { products } = useStorefront();
	const wearable = (0, import_react.useMemo)(() => products.filter((p) => tryOnZoneFor(p)), [products]);
	const seed = wearable.find((p) => p.slug === initialSlug) ?? wearable.find((p) => p.slug === "lahore-jhumkas") ?? wearable.find((p) => p.slug === "thread-chain") ?? wearable[0];
	const [look, setLook] = (0, import_react.useState)(() => lookFromPiece(seed));
	const [zone, setZone] = (0, import_react.useState)("all");
	const [mode, setMode] = (0, import_react.useState)("photo");
	const [portrait, setPortrait] = (0, import_react.useState)(PORTRAITS[0].src);
	const [photoUrl, setPhotoUrl] = (0, import_react.useState)(null);
	const [denied, setDenied] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [backend, setBackend] = (0, import_react.useState)("heuristic");
	const [intel, setIntel] = (0, import_react.useState)(() => buildIntelligence({
		metrics: null,
		lighting: {
			mean: .5,
			variance: .02,
			label: "good"
		},
		look: lookFromPiece(seed),
		catalog: products,
		tracking: "search",
		hasHand: false,
		yaw: 0,
		faceWidth: 0,
		frameWidth: 1,
		ringWidthMm: null,
		wristWidthMm: null
	}));
	const [scaleMul, setScaleMul] = (0, import_react.useState)(1);
	const [nudge, setNudge] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [pinned, setPinned] = (0, import_react.useState)(false);
	const [captures, setCaptures] = (0, import_react.useState)([]);
	const [facing, setFacing] = (0, import_react.useState)("user");
	const [flash, setFlash] = (0, import_react.useState)(false);
	const canvasRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const stillRef = (0, import_react.useRef)(null);
	const visionRef = (0, import_react.useRef)(null);
	const lookRef = (0, import_react.useRef)(look);
	const nudgeRef = (0, import_react.useRef)(nudge);
	const scaleRef = (0, import_react.useRef)(scaleMul);
	const pinRef = (0, import_react.useRef)(pinned);
	const frozenRef = (0, import_react.useRef)(null);
	const productsRef = (0, import_react.useRef)(products);
	const drag = (0, import_react.useRef)(null);
	lookRef.current = look;
	nudgeRef.current = nudge;
	scaleRef.current = scaleMul;
	pinRef.current = pinned;
	productsRef.current = products;
	const wornProducts = lookSlugs(look).map((s) => products.find((p) => p.slug === s)).filter((p) => Boolean(p));
	const bagTotal = wornProducts.reduce((n, p) => n + p.price, 0);
	const addToCart = useSitara((s) => s.addToCart);
	const list = wearable.filter((p) => zone === "all" || tryOnZoneFor(p) === zone);
	(0, import_react.useEffect)(() => {
		if (!initialSlug) return;
		setLook((cur) => {
			if (lookSlugs(cur).includes(initialSlug)) return cur;
			const p = productsRef.current.find((x) => x.slug === initialSlug);
			return p ? lookFromPiece(p) : cur;
		});
	}, [initialSlug]);
	(0, import_react.useEffect)(() => {
		const v = new AtelierVision();
		visionRef.current = v;
		v.init().then(() => {
			setBackend(v.backend);
			setReady(true);
		});
		return () => v.dispose();
	}, []);
	(0, import_react.useEffect)(() => {
		if (mode !== "camera") {
			(videoRef.current?.srcObject)?.getTracks().forEach((t) => t.stop());
			if (videoRef.current) videoRef.current.srcObject = null;
			return;
		}
		let stream = null;
		navigator.mediaDevices?.getUserMedia({
			video: {
				facingMode: facing,
				width: { ideal: 1280 },
				height: { ideal: 720 }
			},
			audio: false
		}).then((s) => {
			stream = s;
			if (videoRef.current) {
				videoRef.current.srcObject = s;
				videoRef.current.play().catch(() => {});
			}
			visionRef.current?.setCamera(videoRef.current);
			setDenied(false);
			setMode("camera");
		}).catch(() => {
			setDenied(true);
			setMode("photo");
		});
		return () => {
			stream?.getTracks().forEach((t) => t.stop());
		};
	}, [mode, facing]);
	(0, import_react.useEffect)(() => {
		if (mode !== "photo") return;
		const img = stillRef.current;
		if (!img) return;
		const apply = () => visionRef.current?.setStill(img);
		if (img.complete) apply();
		else img.addEventListener("load", apply, { once: true });
	}, [
		mode,
		portrait,
		photoUrl
	]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let lastIntel = 0;
		const loop = (t) => {
			raf = requestAnimationFrame(loop);
			const vision = visionRef.current;
			if (!vision) return;
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			const w = Math.max(1, Math.round(rect.width * dpr));
			const h = Math.max(1, Math.round(rect.height * dpr));
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
			}
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			const { result, frame } = vision.tick(t, w, h);
			const used = pinRef.current && frozenRef.current ? frozenRef.current : result;
			if (!pinRef.current) frozenRef.current = result;
			ctx.fillStyle = "#1c1814";
			ctx.fillRect(0, 0, w, h);
			if (frame.width) ctx.drawImage(frame, 0, 0, w, h);
			const lookNow = lookRef.current;
			const catalog = productsRef.current;
			const world = {
				ctx,
				time: t,
				sparkle: used.lighting.label === "dim" ? .25 : used.lighting.label === "harsh" ? .9 : .65,
				reducedMotion: reduced,
				scaleMul: scaleRef.current
			};
			for (const slug of lookSlugs(lookNow)) {
				const product = catalog.find((p) => p.slug === slug);
				if (!product) continue;
				drawProduct(world, product, placementsFor(product, used.face, used.hands, {
					w,
					h
				}, lookNow, nudgeRef.current));
			}
			drawVignette(ctx, w, h);
			if (used.tracking !== "lock") drawScan(ctx, w, h, t);
			drawWatermark(ctx, w, h);
			if (t - lastIntel > 280) {
				lastIntel = t;
				const mm = used.face ? used.face.irisMmPerPx || mmPerPxFromFace(used.face.faceWidth) : 0;
				const ringW = used.hands[0] ? used.hands[0].fingers.ring.width * mm : null;
				const wristW = used.hands[0] ? used.hands[0].bangle.rx * 2 * mm : null;
				setIntel(buildIntelligence({
					metrics: used.metrics,
					lighting: used.lighting,
					look: lookNow,
					catalog,
					tracking: used.tracking,
					hasHand: used.hands.length > 0,
					yaw: used.face?.yaw ?? 0,
					faceWidth: used.face?.faceWidth ?? 0,
					frameWidth: w,
					ringWidthMm: ringW && ringW > 4 ? ringW : null,
					wristWidthMm: wristW && wristW > 20 ? wristW : null
				}));
				setBackend(used.backend);
			}
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, []);
	function onPointerDown(e) {
		drag.current = {
			x: e.clientX,
			y: e.clientY
		};
		e.currentTarget.setPointerCapture(e.pointerId);
	}
	function onPointerMove(e) {
		if (!drag.current) return;
		const host = e.currentTarget.getBoundingClientRect();
		setNudge((n) => ({
			x: n.x + (e.clientX - drag.current.x) / host.width * 100,
			y: n.y + (e.clientY - drag.current.y) / host.height * 100
		}));
		drag.current = {
			x: e.clientX,
			y: e.clientY
		};
	}
	function onPointerUp() {
		drag.current = null;
	}
	function toggle(product) {
		setLook((cur) => applyPiece(cur, product));
		trackEvent("tryon_toggle", { slug: product.slug });
	}
	function capture() {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const url = canvas.toDataURL("image/jpeg", .92);
		setCaptures((c) => [url, ...c].slice(0, 4));
		setFlash(true);
		window.setTimeout(() => setFlash(false), 180);
		trackEvent("tryon_capture", { pieces: pieceCount(look) });
	}
	function downloadCapture(url) {
		const a = document.createElement("a");
		a.href = url;
		a.download = `sitara-atelier-${Date.now()}.jpg`;
		a.click();
	}
	function onFile(e) {
		const f = e.target.files?.[0];
		if (!f) return;
		const r = new FileReader();
		r.onload = () => {
			setPhotoUrl(String(r.result));
			setMode("photo");
		};
		r.readAsDataURL(f);
	}
	const stillSrc = photoUrl ?? portrait;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl overflow-x-hidden px-4 py-8 md:py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.2em] text-stone",
					children: "Atelier Mirror"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl md:text-5xl",
					children: "See it on you"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xl text-ink-soft",
					children: "The mirror reads your face, your light, your undertone. Pieces sit on the ear, the neck, the hand. Nothing is uploaded. Nothing is stored."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.16em] text-stone",
				children: ready ? backend === "mediapipe" ? "Live landmark tracking" : "Atelier tracking" : "Warming the mirror"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-2xl bg-ink shadow-sitara",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
								ref: canvasRef,
								className: "aspect-[3/4] w-full touch-none md:aspect-[4/5]",
								onPointerDown,
								onPointerMove,
								onPointerUp,
								onPointerCancel: onPointerUp
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								className: "hidden",
								playsInline: true,
								muted: true,
								autoPlay: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								ref: stillRef,
								src: stillSrc,
								alt: "",
								className: "hidden",
								crossOrigin: "anonymous"
							}),
							flash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-ivory/70" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-none absolute left-3 right-3 top-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-ivory/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink",
									children: intel.lighting.label === "good" ? "Light held" : intel.lighting.label === "dim" ? "Seek light" : intel.lighting.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-ivory/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink",
									children: [
										intel.shape,
										" · ",
										intel.undertone
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: capture,
								className: "sitara-shutter absolute bottom-4 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full border-2 border-gold bg-ivory/90 text-ink shadow-sitara",
								"aria-label": "Capture look",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "pointer-events-none absolute bottom-20 left-4 right-4 text-center text-xs text-ivory/90 md:bottom-5 md:left-4 md:right-24 md:text-left",
								children: intel.coach
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: mode === "camera" && !denied ? "primary" : "outline",
								onClick: () => setMode("camera"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), "Camera"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: mode === "photo" ? "primary" : "outline",
								onClick: () => setMode("photo"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-4" }), "Portrait"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								"aria-label": pinned ? "Resume tracking" : "Pin placement",
								onClick: () => setPinned((p) => !p),
								children: pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PinOff, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								"aria-label": "Flip camera",
								onClick: () => setFacing((f) => f === "user" ? "environment" : "user"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex h-11 cursor-pointer items-center rounded-lg border border-ink/20 px-4 text-sm",
								children: ["Upload", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: onFile
								})]
							})
						]
					}),
					denied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: "Camera was declined. A portrait will do — gold does not mind."
					}),
					mode === "photo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2",
						children: PORTRAITS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setPhotoUrl(null);
								setPortrait(p.src);
							},
							className: cn("overflow-hidden rounded-lg border", stillSrc === p.src ? "border-emerald" : "border-border"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.src,
								alt: p.label,
								className: "size-14 object-cover"
							})
						}, p.src))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "min-w-0 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-[0.16em] text-stone",
									children: "Harmony"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl tabular-nums",
									children: pieceCount(look) ? intel.harmony : "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1 overflow-hidden rounded-full bg-ivory-deep",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-emerald transition-[width] duration-300",
									style: { width: `${pieceCount(look) ? intel.harmony : 0}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-ink-soft",
								children: intel.metalAdvice
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-ink-soft",
								children: intel.shapeAdvice
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-1 text-xs uppercase tracking-[0.14em] text-stone",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5" }),
											"Lighting ",
											intel.lighting.label
										]
									}),
									intel.ringSizePk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-3.5" }),
											"Ring estimate PK ",
											intel.ringSizePk
										]
									}),
									intel.bangleInches && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-3.5" }),
											"Bangle ",
											intel.bangleInches
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.16em] text-stone",
							children: "Scale"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: .7,
							max: 1.45,
							step: .01,
							value: scaleMul,
							onChange: (e) => setScaleMul(Number(e.target.value)),
							className: "mt-2 w-full accent-emerald",
							"aria-label": "Scale jewellery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-1 text-xs text-stone underline-offset-2 hover:underline",
							onClick: () => setNudge({
								x: 0,
								y: 0
							}),
							children: "Reset drag"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-full gap-1 overflow-x-auto sitara-hide-scrollbar",
						children: ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setZone(z.id),
							className: cn("shrink-0 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]", zone === z.id ? "bg-emerald text-ivory" : "bg-ivory-deep text-ink"),
							children: z.label
						}, z.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid max-h-80 w-full grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:grid-cols-2",
						children: list.map((p) => {
							const on = isWorn(look, p.slug);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggle(p),
								className: cn("w-full overflow-hidden rounded-xl border text-left", on ? "border-emerald bg-card" : "border-border"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.images[0],
									alt: "",
									className: "aspect-square w-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate px-2 py-1.5 font-display text-sm leading-tight",
									children: p.name
								})]
							}) }, p.slug);
						})
					}),
					intel.suggestedSlugs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-stone",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Complete the look"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex gap-2",
						children: intel.suggestedSlugs.map((s) => {
							const p = products.find((x) => x.slug === s);
							if (!p) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggle(p),
								className: "overflow-hidden rounded-lg border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.images[0],
									alt: p.name,
									className: "size-14 object-cover"
								})
							}, s);
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									pieceCount(look),
									" piece",
									pieceCount(look) === 1 ? "" : "s"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: bagTotal ? formatPkr(bagTotal) : "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "mt-3 w-full",
								disabled: wornProducts.length === 0,
								onClick: () => wornProducts.forEach((p) => addToCart(p.slug)),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }), "Add look to bag"]
							}),
							wornProducts[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "mt-1 w-full",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/shop/$slug",
									params: { slug: wornProducts[0].slug },
									children: ["View ", wornProducts[0].name]
								})
							})
						]
					}),
					captures.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.16em] text-stone",
						children: "Sittings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex gap-2",
						children: captures.map((url) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => downloadCapture(url),
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: url,
								alt: "Captured look",
								className: "h-20 w-14 rounded-lg object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "absolute bottom-1 right-1 size-3 text-ivory" })]
						}, url.slice(0, 40)))
					})] })
				]
			})]
		})]
	});
}
function TryOn() {
	const { piece } = Route$8.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtelierStudio, { initialSlug: piece }) });
}
//#endregion
export { TryOn as component };
