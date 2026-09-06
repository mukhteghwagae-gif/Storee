/* ==========================================================================
   SITARA — signature interactive experiences
   Constellation, the scroll-driven Gold Story, the card-calibrated sizing
   ritual, and the drag-and-drop moodboard. Loaded after app.js; each guards
   on its own page so nothing runs where it is not needed.
   ========================================================================== */
(function () {
  "use strict";
  const C = window.CATALOG;
  if (!C) return;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const PAGE = document.body.dataset.page;
  const money = (n) => "PKR " + Math.round(Number(n) || 0).toLocaleString("en-PK");
  const bySlug = (s) => C.products.find((p) => p.slug === s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const COLLECTION_TINT = {
    "bridal-couture": "#d9be83", "everyday-gold": "#c9a24b", "office-edit": "#9db0a6",
    "party-lights": "#c98aa0", "silver-stones": "#a9b7c4", "stack-layer": "#cbb892",
  };

  /* ====================================================== THE CONSTELLATION */
  function initConstellation() {
    const canvas = $("#skyCanvas");
    if (!canvas || PAGE !== "constellation") return;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, stars = [], links = [], t = 0, raf;
    let pan = { x: 0, y: 0 }, target = { x: 0, y: 0 }, dragging = false, last = null, hover = null;

    const collections = C.collections.map((c) => c.slug);
    function layout() {
      stars = [];
      links = [];
      // group pieces by collection; place each collection as a rough cluster
      collections.forEach((col, ci) => {
        const members = C.products.filter((p) => p.collection === col);
        const cx = (0.16 + 0.68 * ((ci % 3) / 2));
        const cy = (0.28 + 0.5 * (Math.floor(ci / 3)));
        const placed = [];
        members.forEach((p, i) => {
          const a = (i / members.length) * Math.PI * 2 + ci;
          const r = 0.06 + 0.05 * ((i % 3) + Math.random() * 0.6);
          const s = {
            p, col,
            x: cx + Math.cos(a) * r * (H / W < 1 ? 1 : 0.7),
            y: cy + Math.sin(a) * r,
            mag: 1.4 + (p.bestSeller ? 1.6 : 0) + (p.featured ? 0.8 : 0) + Math.min(1.4, p.price / 400000),
            tw: Math.random() * Math.PI * 2,
            tint: COLLECTION_TINT[col] || "#d9be83",
          };
          placed.push(s);
          stars.push(s);
        });
        // wire the constellation: nearest-neighbour chain
        placed.forEach((s, i) => { if (i) links.push([placed[i - 1], s, s.tint]); });
      });
    }

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!stars.length) layout();
    }

    const px = (s) => (s.x * W) + pan.x;
    const py = (s) => (s.y * H) + pan.y;

    function draw() {
      t += 0.016;
      pan.x += (target.x - pan.x) * 0.08;
      pan.y += (target.y - pan.y) * 0.08;
      ctx.clearRect(0, 0, W, H);
      // deep sky
      const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
      g.addColorStop(0, "#0b3b32"); g.addColorStop(0.5, "#082a24"); g.addColorStop(1, "#05201b");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // dust
      for (let i = 0; i < 60; i++) {
        const dx = ((i * 137.5 + pan.x * 0.3) % W + W) % W;
        const dy = ((i * 89.3 + pan.y * 0.3) % H + H) % H;
        ctx.fillStyle = "rgba(217,190,131," + (0.05 + 0.05 * Math.sin(t + i)) + ")";
        ctx.fillRect(dx, dy, 1, 1);
      }
      // links
      links.forEach(([a, b, tint]) => {
        ctx.strokeStyle = tint + "33";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px(a), py(a)); ctx.lineTo(px(b), py(b)); ctx.stroke();
      });
      // stars
      stars.forEach((s) => {
        const x = px(s), y = py(s);
        const tw = 0.7 + 0.3 * Math.sin(t * 2 + s.tw);
        const r = s.mag * (hover === s ? 2.4 : 1.6) * tw;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
        halo.addColorStop(0, s.tint + "cc"); halo.addColorStop(1, s.tint + "00");
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(x, y, r * 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = hover === s ? "#fff" : "#fdf6e6";
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        if (hover === s) {
          ctx.fillStyle = "rgba(253,246,230,.9)";
          ctx.font = "13px Jost, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(s.p.name, x, y - r * 6);
        }
      });
      raf = requestAnimationFrame(draw);
    }

    function pick(mx, my) {
      let best = null, bd = 22;
      stars.forEach((s) => {
        const d = Math.hypot(px(s) - mx, py(s) - my);
        if (d < bd) { bd = d; best = s; }
      });
      return best;
    }

    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      if (dragging && last) { target.x += mx - last.x; target.y += my - last.y; last = { x: mx, y: my }; }
      else {
        const s = pick(mx, my);
        canvas.style.cursor = s ? "pointer" : "grab";
        if (s !== hover) { hover = s; readout(s); }
      }
    });
    canvas.addEventListener("pointerdown", (e) => {
      const r = canvas.getBoundingClientRect();
      last = { x: e.clientX - r.left, y: e.clientY - r.top };
      dragging = true; canvas.style.cursor = "grabbing";
    });
    window.addEventListener("pointerup", () => { dragging = false; last = null; });
    canvas.addEventListener("click", (e) => {
      const r = canvas.getBoundingClientRect();
      const s = pick(e.clientX - r.left, e.clientY - r.top);
      if (s) location.href = "product.html?slug=" + s.p.slug;
    });

    function readout(s) {
      const box = $("#skyReadout");
      if (!s) { box.hidden = true; return; }
      box.hidden = false;
      $("#skyThumb").src = s.p.thumbs[0] || s.p.images[0];
      $("#skyCol").textContent = (C.collections.find((c) => c.slug === s.col) || {}).name || "";
      $("#skyName").textContent = s.p.name;
      $("#skyPrice").textContent = money(s.p.price);
      $("#skyLink").href = "product.html?slug=" + s.p.slug;
    }

    $("#skyLegend").innerHTML = C.collections.map((c) =>
      `<button class="constel-legend__item" data-col="${c.slug}"><span style="background:${COLLECTION_TINT[c.slug]}"></span>${c.name}</button>`).join("");
    $("#skyLegend").addEventListener("click", (e) => {
      const b = e.target.closest("[data-col]");
      if (!b) return;
      const first = stars.find((s) => s.col === b.dataset.col);
      if (first) { target.x = W / 2 - first.x * W; target.y = H / 2 - first.y * H; }
    });
    const sh = $("#skyShuffle");
    if (sh) sh.addEventListener("click", () => { stars = []; layout(); });

    resize();
    window.addEventListener("resize", resize);
    if (reduce) { draw(); cancelAnimationFrame(raf); /* one static frame */ }
    else draw();

    const hero = $(".constel-hero");
    setTimeout(() => hero && hero.classList.add("is-lit"), 60);
  }

  /* ======================================================== THE GOLD STORY */
  async function initGoldStory() {
    const story = $("#goldStory");
    if (!story || PAGE !== "gold-story") return;
    // A representative bridal piece drives the true figures.
    const piece = bySlug("mughal-choker") || C.products.find((p) => p.metal === "gold");
    let rate = { tola24k: 358400 };
    try {
      const r = await fetch((window.SITARA_API || "") + "/api/gold-rate");
      if (r.ok) rate = await r.json();
    } catch (e) {}
    const TOLA = 11.6638;
    const metal = Math.round(piece.weightG * (rate.tola24k / TOLA) * 0.916);
    const making = piece.makingPkr;
    const stones = Math.max(0, piece.price - metal - making);
    const total = metal + making + stones;
    const pct = (v) => (v / total) * 100;

    $("#storyFigure").innerHTML = `<div class="story__label">${piece.name} · ${piece.weightG} g · 22k</div>`;
    $("#sceneMetal").innerHTML = `For the ${piece.name}: ${piece.weightG} grams at today's 22k rate is <b>${money(metal)}</b>. That is ${Math.round(pct(metal))}% of the price, and it is the same gold you would buy anywhere — the rate is public.`;
    $("#sceneTotal").innerHTML = `${money(metal)} of gold, ${money(making)} of making${stones > 500 ? ", " + money(stones) + " of stones" : ""} — <b>${money(total)}</b>, GST inside. Every figure on your receipt, nothing hidden in a round number.`;

    const ingot = $("#ingot");
    const segs = { metal: $(".ingot__metal", ingot), making: $(".ingot__making", ingot), stones: $(".ingot__stones", ingot) };
    segs.metal.style.setProperty("--pct", pct(metal) + "%");
    segs.making.style.setProperty("--pct", pct(making) + "%");
    segs.stones.style.setProperty("--pct", pct(stones) + "%");
    if (stones < 500) segs.stones.style.display = "none";

    const scenes = $$(".story__scene");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const n = Number(e.target.dataset.scene);
        ingot.dataset.reveal = n;
        scenes.forEach((s) => s.classList.toggle("is-active", s === e.target));
      });
    }, { rootMargin: "-40% 0px -40% 0px" });
    scenes.forEach((s) => io.observe(s));
  }

  /* =================================================== THE SIZING RITUAL */
  function initSizingRitual() {
    if (PAGE !== "measure") return;
    // A standard ISO/IEC 7810 ID-1 card is 85.60 mm wide.
    const CARD_MM = 85.6;
    let pxPerMm = null;

    const card = $("#calibCard");
    const cs = $("#calibSlider");
    function calib() {
      const wpx = Number(cs.value);
      card.style.width = wpx + "px";
      card.style.height = wpx / 1.5858 + "px"; // card aspect ratio
      pxPerMm = wpx / CARD_MM;
      measure();
      $(".ritual-step[data-step='2']").classList.add("is-ready");
    }
    cs.addEventListener("input", calib);

    const circle = $("#ringCircle");
    const rs = $("#ringSlider");
    function measure() {
      const dpx = Number(rs.value);
      circle.style.width = circle.style.height = dpx + "px";
      if (!pxPerMm) return;
      const mm = dpx / pxPerMm;
      $("#ringOut").innerHTML = `Inner diameter ≈ <b>${mm.toFixed(1)} mm</b>`;
      const circ = mm * Math.PI;
      const hit = C.ringSizes.reduce((a, b) => Math.abs(b.mm - circ) < Math.abs(a.mm - circ) ? b : a);
      $("#ritualResult").innerHTML = `
        <div class="ritual-size">
          <div><div class="label">Pakistan / India</div><div class="ritual-size__big">${hit.pk}</div></div>
          <div><div class="label">UK</div><div class="ritual-size__big">${hit.uk}</div></div>
          <div><div class="label">US</div><div class="ritual-size__big">${hit.us}</div></div>
        </div>
        <p class="fine">Measured inner circumference ≈ ${circ.toFixed(1)} mm. If a ring sits between two, we make the larger.</p>
        <a class="btn btn--sm" href="shop.html?category=ring">Shop rings in size ${hit.pk}</a>`;
      $(".ritual-step[data-step='3']").classList.add("is-ready");
    }
    rs.addEventListener("input", measure);
    calib();
  }

  /* ====================================================== THE MOODBOARD */
  function initMoodboard() {
    if (PAGE !== "moodboard") return;
    const board = $("#moodBoard");
    const tray = $("#moodTray");
    const store = {
      get() { try { return JSON.parse(localStorage.getItem("sitara:mood") || "[]"); } catch (e) { return []; } },
      set(v) { try { localStorage.setItem("sitara:mood", JSON.stringify(v)); } catch (e) {} },
    };
    let placed = store.get();

    function paintTray(filter) {
      const list = C.products.filter((p) => !filter || (p.name + p.category + p.metal).toLowerCase().includes(filter.toLowerCase()));
      tray.innerHTML = list.map((p) =>
        `<button class="mood-chip" draggable="true" data-slug="${p.slug}" title="${p.name}">
          <img src="${p.thumbs[0]}" alt="${p.name}"><span>${money(p.price)}</span></button>`).join("");
    }
    function paintBoard() {
      $("#moodEmpty").style.display = placed.length ? "none" : "";
      $$(".mood-item", board).forEach((el) => el.remove());
      placed.forEach((it) => {
        const p = bySlug(it.slug);
        if (!p) return;
        const el = document.createElement("div");
        el.className = "mood-item";
        el.style.left = it.x + "%"; el.style.top = it.y + "%"; el.style.width = it.w + "px";
        el.dataset.slug = it.slug;
        el.innerHTML = `<img src="${p.images[0]}" alt="${p.name}" draggable="false">
          <div class="mood-item__label">${p.name}<br>${money(p.price)}</div>
          <button class="mood-item__x" data-remove="${it.slug}" aria-label="Remove">×</button>`;
        board.appendChild(el);
        makeDraggable(el, it);
      });
      const total = placed.reduce((a, it) => { const p = bySlug(it.slug); return a + (p ? p.price : 0); }, 0);
      $("#moodTotal").innerHTML = placed.length
        ? `<span class="label">The look</span> ${placed.length} pieces · <b>${money(total)}</b>`
        : "";
    }
    function add(slug, x = 40 + Math.random() * 20, y = 30 + Math.random() * 20) {
      if (placed.find((i) => i.slug === slug)) return;
      placed.push({ slug, x, y, w: 150 });
      store.set(placed); paintBoard();
    }
    function makeDraggable(el, it) {
      let sx, sy, ox, oy, drag = false;
      el.addEventListener("pointerdown", (e) => {
        if (e.target.closest("[data-remove]")) return;
        drag = true; el.setPointerCapture(e.pointerId);
        el.style.zIndex = ++window._moodZ || (window._moodZ = 10);
        const r = board.getBoundingClientRect();
        sx = e.clientX; sy = e.clientY; ox = it.x; oy = it.y;
        el._r = r;
      });
      el.addEventListener("pointermove", (e) => {
        if (!drag) return;
        it.x = Math.max(0, Math.min(90, ox + ((e.clientX - sx) / el._r.width) * 100));
        it.y = Math.max(0, Math.min(88, oy + ((e.clientY - sy) / el._r.height) * 100));
        el.style.left = it.x + "%"; el.style.top = it.y + "%";
      });
      el.addEventListener("pointerup", () => { if (drag) { drag = false; store.set(placed); } });
    }

    tray.addEventListener("click", (e) => { const b = e.target.closest("[data-slug]"); if (b) add(b.dataset.slug); });
    tray.addEventListener("dragstart", (e) => { const b = e.target.closest("[data-slug]"); if (b) e.dataTransfer.setData("text/slug", b.dataset.slug); });
    board.addEventListener("dragover", (e) => e.preventDefault());
    board.addEventListener("drop", (e) => {
      e.preventDefault();
      const slug = e.dataTransfer.getData("text/slug");
      if (!slug) return;
      const r = board.getBoundingClientRect();
      add(slug, ((e.clientX - r.left) / r.width) * 100 - 5, ((e.clientY - r.top) / r.height) * 100 - 5);
    });
    board.addEventListener("click", (e) => {
      const b = e.target.closest("[data-remove]");
      if (!b) return;
      placed = placed.filter((i) => i.slug !== b.dataset.remove);
      store.set(placed); paintBoard();
    });
    $("#moodSearch").addEventListener("input", (e) => paintTray(e.target.value));
    $("#moodClear").addEventListener("click", () => { placed = []; store.set(placed); paintBoard(); });
    $("#moodBag").addEventListener("click", () => {
      if (!placed.length) return;
      placed.forEach((it) => window.Cart && window.Cart.add(it.slug, { quiet: true }));
      window.Cart && window.Cart.paint();
      document.querySelector("[data-open-cart]") && document.getElementById("cartDrawer").classList.add("is-open");
      document.getElementById("scrim").classList.add("is-open");
    });
    $("#moodShare").addEventListener("click", () => {
      if (!placed.length) return;
      const lines = placed.map((it) => { const p = bySlug(it.slug); return "• " + p.name + " — " + money(p.price); }).join("\n");
      location.href = (window.waLink ? window.waLink("The look I have put together at Sitara:\n" + lines) : "#");
    });

    paintTray("");
    paintBoard();
  }

  function init() {
    initConstellation();
    initGoldStory();
    initSizingRitual();
    initMoodboard();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
