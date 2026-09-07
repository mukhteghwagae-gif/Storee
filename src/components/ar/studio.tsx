import { useEffect, useMemo, useRef, useState, type PointerEvent, type ChangeEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Aperture,
  Camera,
  Download,
  FlipHorizontal,
  Image as ImageIcon,
  Pin,
  PinOff,
  ScanLine,
  ShoppingBag,
  Sparkles,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStorefront } from "@/components/storefront";
import { formatPkr } from "@/lib/format";
import { useSitara } from "@/lib/store";
import { tryOnZoneFor, applyPiece, isWorn, lookFromPiece, buildIntelligence, mmPerPxFromFace } from "@/lib/ar/intelligence";
import { AtelierVision } from "@/lib/ar/vision";
import { drawProduct, drawScan, drawVignette, drawWatermark } from "@/lib/ar/jewelry";
import { placementsFor, type Nudge } from "@/lib/ar/place";
import { emptyLook, lookSlugs, pieceCount, type FrameResult, type LookState, type TryOnZone } from "@/lib/ar/types";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/catalog";
import { trackEvent } from "@/lib/analytics";

const ZONES: { id: TryOnZone | "all"; label: string }[] = [
  { id: "all", label: "The look" },
  { id: "ear", label: "Ears" },
  { id: "neck", label: "Neck" },
  { id: "forehead", label: "Tikka" },
  { id: "hand", label: "Rings" },
  { id: "wrist", label: "Wrist" },
];

const PORTRAITS = [
  { src: "/editorial/everyday.jpg", label: "Neck" },
  { src: "/editorial/bridal.jpg", label: "Hand" },
  { src: "/editorial/hero.jpg", label: "Atelier" },
];

export function AtelierStudio({ initialSlug }: { initialSlug?: string }) {
  const { products } = useStorefront();
  const wearable = useMemo(() => products.filter((p) => tryOnZoneFor(p)), [products]);
  const seed =
    wearable.find((p) => p.slug === initialSlug) ??
    wearable.find((p) => p.slug === "thread-chain") ??
    wearable.find((p) => p.slug === "lahore-jhumkas") ??
    wearable[0];
  const [look, setLook] = useState<LookState>(() => lookFromPiece(seed));
  const [zone, setZone] = useState<TryOnZone | "all">("all");
  const [mode, setMode] = useState<"camera" | "photo">("photo");
  const [portrait, setPortrait] = useState(PORTRAITS[0].src);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [ready, setReady] = useState(false);
  const [backend, setBackend] = useState("heuristic");
  const [intel, setIntel] = useState(() =>
    buildIntelligence({
      metrics: null,
      lighting: { mean: 0.5, variance: 0.02, label: "good" },
      look: lookFromPiece(seed),
      catalog: products,
      tracking: "search",
      hasHand: false,
      yaw: 0,
      faceWidth: 0,
      frameWidth: 1,
      ringWidthMm: null,
      wristWidthMm: null,
    }),
  );
  const [scaleMul, setScaleMul] = useState(1);
  const [nudge, setNudge] = useState<Nudge>({ x: 0, y: 0 });
  const [pinned, setPinned] = useState(false);
  const [captures, setCaptures] = useState<string[]>([]);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [flash, setFlash] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const visionRef = useRef<AtelierVision | null>(null);
  const lookRef = useRef(look);
  const nudgeRef = useRef(nudge);
  const scaleRef = useRef(scaleMul);
  const pinRef = useRef(pinned);
  const frozenRef = useRef<FrameResult | null>(null);
  const productsRef = useRef(products);
  const drag = useRef<{ x: number; y: number } | null>(null);

  lookRef.current = look;
  nudgeRef.current = nudge;
  scaleRef.current = scaleMul;
  pinRef.current = pinned;
  productsRef.current = products;

  const wornProducts = lookSlugs(look)
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));
  const bagTotal = wornProducts.reduce((n, p) => n + p.price, 0);
  const addToCart = useSitara((s) => s.addToCart);

  const list = wearable.filter((p) => zone === "all" || tryOnZoneFor(p) === zone);

  useEffect(() => {
    if (!initialSlug) return;
    setLook((cur) => {
      if (lookSlugs(cur).includes(initialSlug)) return cur;
      const p = productsRef.current.find((x) => x.slug === initialSlug);
      return p ? lookFromPiece(p) : cur;
    });
  }, [initialSlug]);

  useEffect(() => {
    const v = new AtelierVision();
    visionRef.current = v;
    void v.init().then(() => {
      setBackend(v.backend);
      setReady(true);
    });
    return () => v.dispose();
  }, []);

  useEffect(() => {
    if (mode !== "camera") {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }
    let stream: MediaStream | null = null;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          void videoRef.current.play().catch(() => {});
        }
        visionRef.current?.setCamera(videoRef.current);
        setDenied(false);
        setMode("camera");
      })
      .catch(() => {
        setDenied(true);
        setMode("photo");
      });
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [mode, facing]);

  useEffect(() => {
    if (mode !== "photo") return;
    const img = stillRef.current;
    if (!img) return;
    const apply = () => visionRef.current?.setStill(img);
    if (img.complete) apply();
    else img.addEventListener("load", apply, { once: true });
  }, [mode, portrait, photoUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastIntel = 0;
    const loop = (t: number) => {
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
      const sparkle = used.lighting.label === "dim" ? 0.25 : used.lighting.label === "harsh" ? 0.9 : 0.65;
      const world = { ctx, time: t, sparkle, reducedMotion: reduced, scaleMul: scaleRef.current };
      for (const slug of lookSlugs(lookNow)) {
        const product = catalog.find((p) => p.slug === slug);
        if (!product) continue;
        const places = placementsFor(product, used.face, used.hands, { w, h }, lookNow, nudgeRef.current);
        drawProduct(world, product, places);
      }
      drawVignette(ctx, w, h);
      if (used.tracking !== "lock") drawScan(ctx, w, h, t);
      drawWatermark(ctx, w, h);

      if (t - lastIntel > 280) {
        lastIntel = t;
        const mm = used.face ? used.face.irisMmPerPx || mmPerPxFromFace(used.face.faceWidth) : 0;
        const ringW = used.hands[0] ? used.hands[0].fingers.ring.width * mm : null;
        const wristW = used.hands[0] ? used.hands[0].bangle.rx * 2 * mm : null;
        setIntel(
          buildIntelligence({
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
            wristWidthMm: wristW && wristW > 20 ? wristW : null,
          }),
        );
        setBackend(used.backend);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onPointerDown(e: PointerEvent<HTMLCanvasElement>) {
    drag.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent<HTMLCanvasElement>) {
    if (!drag.current) return;
    const host = e.currentTarget.getBoundingClientRect();
    setNudge((n) => ({
      x: n.x + ((e.clientX - drag.current!.x) / host.width) * 100,
      y: n.y + ((e.clientY - drag.current!.y) / host.height) * 100,
    }));
    drag.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp() {
    drag.current = null;
  }

  function toggle(product: Product) {
    setLook((cur) => applyPiece(cur, product));
    trackEvent("tryon_toggle", { slug: product.slug });
  }

  function capture() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/jpeg", 0.92);
    setCaptures((c) => [url, ...c].slice(0, 4));
    setFlash(true);
    window.setTimeout(() => setFlash(false), 180);
    trackEvent("tryon_capture", { pieces: pieceCount(look) });
  }

  function downloadCapture(url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `sitara-atelier-${Date.now()}.jpg`;
    a.click();
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
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

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-4 py-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Atelier Mirror</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">See it on you</h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            The mirror reads your face, your light, your undertone. Pieces sit on the ear, the neck, the hand.
            Nothing is uploaded. Nothing is stored.
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone">
          {ready ? (backend === "mediapipe" ? "Live landmark tracking" : "Atelier tracking") : "Warming the mirror"}
        </p>
      </div>

      <div className="mt-8 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-2xl bg-ink shadow-sitara">
            <canvas
              ref={canvasRef}
              className="aspect-[3/4] w-full touch-none md:aspect-[4/5]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
            <video ref={videoRef} className="hidden" playsInline muted autoPlay />
            <img ref={stillRef} src={stillSrc} alt="" className="hidden" crossOrigin="anonymous" />
            {flash && <div className="pointer-events-none absolute inset-0 bg-ivory/70" />}
            <div className="pointer-events-none absolute left-3 right-3 top-3 flex flex-wrap gap-2">
              <span className="rounded-md bg-ivory/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink">
                {intel.lighting.label === "good" ? "Light held" : intel.lighting.label === "dim" ? "Seek light" : intel.lighting.label}
              </span>
              <span className="rounded-md bg-ivory/90 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-ink">
                {intel.shape} · {intel.undertone}
              </span>
            </div>
            <button
              type="button"
              onClick={capture}
              className="sitara-shutter absolute bottom-4 left-1/2 grid size-14 -translate-x-1/2 place-items-center rounded-full border-2 border-gold bg-ivory/90 text-ink shadow-sitara"
              aria-label="Capture look"
            >
              <Aperture className="size-5" />
            </button>
            <p className="pointer-events-none absolute bottom-20 left-4 right-4 text-center text-xs text-ivory/90 md:bottom-5 md:left-4 md:right-24 md:text-left">
              {intel.coach}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant={mode === "camera" && !denied ? "primary" : "outline"} onClick={() => setMode("camera")}>
              <Camera className="size-4" />
              Camera
            </Button>
            <Button variant={mode === "photo" ? "primary" : "outline"} onClick={() => setMode("photo")}>
              <ImageIcon className="size-4" />
              Portrait
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={pinned ? "Resume tracking" : "Pin placement"}
              onClick={() => setPinned((p) => !p)}
            >
              {pinned ? <Pin className="size-4" /> : <PinOff className="size-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Flip camera"
              onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}
            >
              <FlipHorizontal className="size-4" />
            </Button>
            <label className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-ink/20 px-4 text-sm">
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </div>
          {denied && (
            <p className="mt-2 text-sm text-ink-soft">Camera was declined. A portrait will do — gold does not mind.</p>
          )}
          {mode === "photo" && (
            <div className="mt-3 flex gap-2">
              {PORTRAITS.map((p) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => {
                    setPhotoUrl(null);
                    setPortrait(p.src);
                  }}
                  className={cn(
                    "overflow-hidden rounded-lg border",
                    stillSrc === p.src ? "border-emerald" : "border-border",
                  )}
                >
                  <img src={p.src} alt={p.label} className="size-14 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Harmony</p>
              <p className="font-display text-3xl tabular-nums">{pieceCount(look) ? intel.harmony : "—"}</p>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-ivory-deep">
              <div
                className="h-full bg-emerald transition-[width] duration-300"
                style={{ width: `${pieceCount(look) ? intel.harmony : 0}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-ink-soft">{intel.metalAdvice}</p>
            <p className="mt-2 text-sm text-ink-soft">{intel.shapeAdvice}</p>
            <ul className="mt-4 space-y-1 text-xs uppercase tracking-[0.14em] text-stone">
              <li className="flex items-center gap-2">
                <Sun className="size-3.5" />
                Lighting {intel.lighting.label}
              </li>
              {intel.ringSizePk && (
                <li className="flex items-center gap-2">
                  <ScanLine className="size-3.5" />
                  Ring estimate PK {intel.ringSizePk}
                </li>
              )}
              {intel.bangleInches && (
                <li className="flex items-center gap-2">
                  <ScanLine className="size-3.5" />
                  Bangle {intel.bangleInches}
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Scale</p>
            <input
              type="range"
              min={0.7}
              max={1.45}
              step={0.01}
              value={scaleMul}
              onChange={(e) => setScaleMul(Number(e.target.value))}
              className="mt-2 w-full accent-emerald"
              aria-label="Scale jewellery"
            />
            <button type="button" className="mt-1 text-xs text-stone underline-offset-2 hover:underline" onClick={() => setNudge({ x: 0, y: 0 })}>
              Reset drag
            </button>
          </div>

          <div className="flex w-full gap-1 overflow-x-auto sitara-hide-scrollbar">
            {ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setZone(z.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]",
                  zone === z.id ? "bg-emerald text-ivory" : "bg-ivory-deep text-ink",
                )}
              >
                {z.label}
              </button>
            ))}
          </div>

          <ul className="grid max-h-80 w-full grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:grid-cols-2">
            {list.map((p) => {
              const on = isWorn(look, p.slug);
              return (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => toggle(p)}
                    className={cn(
                      "w-full overflow-hidden rounded-xl border text-left",
                      on ? "border-emerald bg-card" : "border-border",
                    )}
                  >
                    <img src={p.images[0]} alt="" className="aspect-square w-full object-cover" />
                    <span className="block truncate px-2 py-1.5 font-display text-sm leading-tight">{p.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {intel.suggestedSlugs.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-stone">
                <Sparkles className="size-3.5" /> Complete the look
              </p>
              <div className="mt-2 flex gap-2">
                {intel.suggestedSlugs.map((s) => {
                  const p = products.find((x) => x.slug === s);
                  if (!p) return null;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggle(p)}
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      <img src={p.images[0]} alt={p.name} className="size-14 object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm">
              <span>{pieceCount(look)} piece{pieceCount(look) === 1 ? "" : "s"}</span>
              <span className="tabular-nums">{bagTotal ? formatPkr(bagTotal) : "—"}</span>
            </div>
            <Button
              className="mt-3 w-full"
              disabled={wornProducts.length === 0}
              onClick={() => wornProducts.forEach((p) => addToCart(p.slug))}
            >
              <ShoppingBag className="size-4" />
              Add look to bag
            </Button>
            {wornProducts[0] && (
              <Button variant="ghost" className="mt-1 w-full" asChild>
                <Link to="/shop/$slug" params={{ slug: wornProducts[0].slug }}>
                  View {wornProducts[0].name}
                </Link>
              </Button>
            )}
          </div>

          {captures.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone">Sittings</p>
              <div className="mt-2 flex gap-2">
                {captures.map((url) => (
                  <button key={url.slice(0, 40)} type="button" onClick={() => downloadCapture(url)} className="relative">
                    <img src={url} alt="Captured look" className="h-20 w-14 rounded-lg object-cover" />
                    <Download className="absolute bottom-1 right-1 size-3 text-ivory" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
