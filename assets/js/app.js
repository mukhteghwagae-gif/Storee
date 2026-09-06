/* ==========================================================================
   SITARA — storefront behaviour
   No framework, no build step. Runs from file://, a CDN, or behind the API.
   Set window.SITARA_API to your server URL to switch from demo data to live.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const CFG = {
    API: window.SITARA_API || "",
    WHATSAPP: window.SITARA_WHATSAPP || "923001234567",
    FREE_SHIPPING: 5000,
    STACK_RATE: 0.1,
    STACK_MIN: 3,
    GIFT_WRAP: 650,
    GST: 0.18,
    COIN_RATE: 1,
    COD_MAX: 200000,
  };
  window.SITARA_CFG = CFG;

  const C = window.CATALOG;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const PAGE = document.body.dataset.page;

  const money = (n) => "PKR " + Math.round(Number(n) || 0).toLocaleString("en-PK");
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  const param = (k) => new URLSearchParams(location.search).get(k);
  const titleCase = (s) => String(s || "").replace(/(^|\s|-)\w/g, (m) => m.toUpperCase()).replace(/-/g, " ");
  const bySlug = (slug) => C.products.find((p) => p.slug === slug);
  const byId = (id) => C.products.find((p) => p.id === Number(id));

  /* ------------------------------------------------------------- storage */
  const store = {
    get(k, d) {
      try { const v = localStorage.getItem("sitara:" + k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set(k, v) { try { localStorage.setItem("sitara:" + k, JSON.stringify(v)); } catch (e) {} },
  };

  /* --------------------------------------------------------------- toast */
  let toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove("is-on"), 2800);
  }

  function waLink(text) {
    return "https://wa.me/" + CFG.WHATSAPP + "?text=" +
      encodeURIComponent(text || "Assalam o alaikum — I have a question about a piece.");
  }
  window.waLink = waLink;

  async function api(path, opts) {
    if (!CFG.API) throw new Error("offline");
    const res = await fetch(CFG.API + path, Object.assign({ headers: { "Content-Type": "application/json" } }, opts));
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }


  /* --------------------------------------------------------- event beacon
     One tiny call per meaningful action. Powers the recommender's training and
     the admin trend numbers. No cookies; the visitor id is a random local
     token, never tied to a name. */
  function beacon(type, extra) {
    if (!CFG.API) return;
    let id = store.get("visitor", null);
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); store.set("visitor", id); }
    try {
      fetch(CFG.API + "/api/events", {
        method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
        body: JSON.stringify(Object.assign({ type, visitorId: id, path: location.pathname }, extra || {})),
      }).catch(() => {});
    } catch (e) {}
  }
  window.sitaraBeacon = beacon;

  /* ------------------------------------------------------------ gold rate
     One fetch per page, shared by the ticker, the PDP breakdown and the
     calculator. Falls back to a stable local figure so nothing is ever blank. */
  const TOLA = 11.6638;
  let ratePromise;
  function goldRate() {
    if (ratePromise) return ratePromise;
    ratePromise = (async () => {
      if (CFG.API) {
        try { return await api("/api/gold-rate"); } catch (e) {}
      }
      const day = Math.floor(Date.now() / 864e5);
      const tola24k = 358400 + Math.round(Math.sin(day / 6) * 4200 + Math.cos(day / 2.7) * 1800);
      return {
        tola24k,
        gram24k: Math.round(tola24k / TOLA),
        gram22k: Math.round((tola24k / TOLA) * 0.916),
        gram21k: Math.round((tola24k / TOLA) * 0.875),
        gram18k: Math.round((tola24k / TOLA) * 0.75),
        source: "estimate",
        updatedAt: new Date().toISOString(),
      };
    })();
    return ratePromise;
  }

  async function paintTicker() {
    const el = $("#goldRate");
    if (!el) return;
    const r = await goldRate();
    el.innerHTML =
      `24k <b>${money(r.tola24k)}</b> / tola · 22k <b>${money(r.gram22k)}</b> / gram · ` +
      `Complimentary delivery over ${money(CFG.FREE_SHIPPING)}`;
  }

  const purity = { gold: 0.916, silver: 0, plated: 0 };
  function metalValue(p, rate) {
    if (p.metal !== "gold" || !rate) return 0;
    const k = p.karat === "18k" ? 0.75 : p.karat === "21k" ? 0.875 : 0.916;
    return Math.round(p.weightG * (rate.tola24k / TOLA) * k);
  }

  /* ------------------------------------------------------------------ i18n
     A light EN/UR switch. Anything carrying data-ur swaps its text and the
     document flips to RTL with a Nastaliq face. */
  const UR = {
    "Shop": "خریداری", "Bridal": "دلہن", "Collections": "مجموعے", "Our craft": "ہمارا فن",
    "The Journal": "جرنل", "Add to bag": "بیگ میں ڈالیں", "Checkout": "ادائیگی",
    "Your bag": "آپ کا بیگ", "Search": "تلاش", "Saved": "محفوظ", "Home": "صفحۂ اول",
  };
  function applyLang(lang) {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ur" ? "rtl" : "ltr";
    const label = $("#langLabel");
    if (label) label.textContent = lang === "ur" ? "EN" : "اردو";
    $$(".nav a, .tabbar span").forEach((el) => {
      if (!el.dataset.en) el.dataset.en = el.textContent.trim();
      el.textContent = lang === "ur" ? UR[el.dataset.en] || el.dataset.en : el.dataset.en;
    });
  }
  function initLang() {
    const saved = store.get("lang", "en");
    if (saved === "ur") applyLang("ur");
    $$("[data-lang-toggle]").forEach((b) =>
      b.addEventListener("click", () => {
        const next = document.documentElement.lang === "ur" ? "en" : "ur";
        store.set("lang", next);
        applyLang(next);
        toast(next === "ur" ? "اردو میں" : "Back to English");
      })
    );
  }

  /* ------------------------------------------------------------------ cart */
  const Cart = {
    items: store.get("cart", []),
    save() { store.set("cart", this.items); this.paint(); this.track(); },
    key(p, opts) { return [p.id, opts.size || "", opts.bundle || ""].join("|"); },
    add(id, opts) {
      opts = opts || {};
      const p = byId(id) || bySlug(id);
      if (!p) return;
      if (p.stock < 1) return toast("That one has gone — join the waiting list on its page");
      const key = this.key(p, opts);
      const found = this.items.find((i) => i.key === key);
      const unit = opts.bundle === "stack" ? Math.round(p.price * (1 - CFG.STACK_RATE)) : p.price;
      if (found) found.qty = Math.min(p.stock, found.qty + (opts.qty || 1));
      else { window.sitaraBeacon && window.sitaraBeacon("add_to_cart", { slug: p.slug });
        window.sitaraTrack && window.sitaraTrack("add_to_cart", { item_id: p.slug, item_name: p.name, price: unit, currency: "PKR" });
        this.items.push({
        key, id: p.id, slug: p.slug, name: p.name, price: unit, image: p.thumbs[0] || p.images[0],
        size: opts.size || "", bundle: opts.bundle || "", qty: Math.min(p.stock, opts.qty || 1),
      }); }
      this.save();
      if (!opts.quiet) { toast(p.name + " added to your bag"); openDrawer(); }
    },
    remove(key) { this.items = this.items.filter((i) => i.key !== key); this.save(); },
    qty(key, delta) {
      const i = this.items.find((x) => x.key === key);
      if (!i) return;
      const p = byId(i.id);
      i.qty += delta;
      if (i.qty < 1) return this.remove(key);
      if (p && i.qty > p.stock) { i.qty = p.stock; toast("That is all we have of this one"); }
      this.save();
    },
    count() { return this.items.reduce((a, i) => a + i.qty, 0); },
    subtotal() { return this.items.reduce((a, i) => a + i.price * i.qty, 0); },
    clear() { this.items = []; this.save(); },
    track() {
      if (!CFG.API || !this.items.length) return;
      let id = store.get("visitor", null);
      if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); store.set("visitor", id); }
      fetch(CFG.API + "/api/carts/track", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: id, items: this.items, total: this.subtotal() }),
        keepalive: true,
      }).catch(() => {});
    },
    paint() {
      $$("[data-cart-count]").forEach((el) => {
        el.textContent = this.count();
        el.style.display = this.count() ? "" : "none";
      });
      const body = $("#drawerBody");
      if (body) {
        body.innerHTML = this.items.length
          ? this.items.map((i) => `
            <div class="line-item">
              <img src="${i.image}" alt="${esc(i.name)}" loading="lazy">
              <div>
                <a class="line-item__name" href="product.html?slug=${i.slug}">${esc(i.name)}</a>
                ${i.size ? `<div class="fine">Size ${esc(i.size)}</div>` : ""}
                ${i.bundle ? `<div class="fine" style="color:var(--gulabi)">Stack bundle · 10% off</div>` : ""}
                <div class="qty">
                  <button data-qty="${i.key}" data-d="-1" aria-label="Reduce quantity">−</button>
                  <span>${i.qty}</span>
                  <button data-qty="${i.key}" data-d="1" aria-label="Increase quantity">+</button>
                </div>
              </div>
              <div style="text-align:right">
                <div>${money(i.price * i.qty)}</div>
                <button class="fine" data-rm="${i.key}" style="border-bottom:1px solid var(--line)">Remove</button>
              </div>
            </div>`).join("")
          : `<p class="fine">Your bag is empty. Start with <a class="link-quiet" href="shop.html?occasion=everyday">everyday gold</a>, or <a class="link-quiet" href="finder.html">let us find something</a>.</p>`;
      }
      const t = this.subtotal();
      const bar = $("#freeshipBar");
      if (bar) {
        bar.style.width = Math.min(100, (t / CFG.FREE_SHIPPING) * 100) + "%";
        const left = Math.max(0, CFG.FREE_SHIPPING - t);
        $("#freeshipText").textContent = t === 0
          ? `Complimentary delivery over ${money(CFG.FREE_SHIPPING)}`
          : left ? `Add ${money(left)} more for complimentary delivery`
          : "Delivery is on us";
      }
      const st = $("#drawerTotal");
      if (st) st.textContent = money(t);
      const pts = $("#drawerPoints");
      if (pts) pts.textContent = Math.floor(t / 100);
    },
  };
  window.Cart = Cart;

  /* --------------------------------------------------- wishlist & compare */
  const Wish = {
    list: store.get("wish", []),
    has(slug) { return this.list.includes(slug); },
    toggle(slug) {
      const i = this.list.indexOf(slug);
      if (i > -1) { this.list.splice(i, 1); toast("Removed from saved"); }
      else { this.list.push(slug); toast("Saved"); }
      store.set("wish", this.list);
      this.paint();
    },
    paint() {
      $$("[data-wish-count]").forEach((el) => {
        el.textContent = this.list.length;
        el.style.display = this.list.length ? "" : "none";
      });
      $$("[data-wish]").forEach((b) => b.setAttribute("aria-pressed", this.has(b.dataset.wish)));
      const fig = $("#wishFigure");
      if (fig) fig.textContent = this.list.length;
    },
  };
  const Compare = {
    list: store.get("compare", []),
    toggle(slug) {
      const i = this.list.indexOf(slug);
      if (i > -1) this.list.splice(i, 1);
      else {
        if (this.list.length >= 4) return toast("Four at a time — remove one first");
        this.list.push(slug);
        toast("Added to compare · " + this.list.length);
      }
      store.set("compare", this.list);
      $$("[data-compare]").forEach((b) => b.setAttribute("aria-pressed", this.list.includes(b.dataset.compare)));
    },
  };
  const Recent = {
    list: store.get("recent", []),
    push(slug) {
      this.list = [slug].concat(this.list.filter((s) => s !== slug)).slice(0, 8);
      store.set("recent", this.list);
    },
  };

  /* ---------------------------------------------------------- product card */
  function cardHTML(p, opts) {
    opts = opts || {};
    const low = p.stock > 0 && p.stock <= 3;
    const flag = p.stock === 0 ? '<span class="card__flag">Sold out</span>'
      : low ? `<span class="card__flag card__flag--low">Only ${p.stock} left</span>`
      : p.newest ? '<span class="card__flag card__flag--new">New</span>'
      : p.compareAt ? '<span class="card__flag">Reduced</span>' : "";
    return `<article class="card reveal sparkle-host" data-slug="${p.slug}">
      <div class="card__tools">
        <button data-wish="${p.slug}" aria-pressed="${Wish.has(p.slug)}" aria-label="Save ${esc(p.name)}" title="Save">♡</button>
        <button data-compare="${p.slug}" aria-pressed="${Compare.list.includes(p.slug)}" aria-label="Compare ${esc(p.name)}" title="Compare">⇄</button>
        <button data-quick-view="${p.slug}" aria-label="Quick view" title="Quick view">↗</button>
      </div>
      <a href="product.html?slug=${p.slug}" class="card__media" aria-label="${esc(p.name)}">
        ${flag}
        <img src="${p.thumbs[0]}" alt="${esc(p.name)} — ${esc(p.subtitle)}" loading="${opts.eager ? "eager" : "lazy"}" width="600" height="800">
        <img class="alt" src="${p.thumbs[1] || p.thumbs[0]}" alt="" aria-hidden="true" loading="lazy">
        ${p.stock ? `<span class="card__quick shimmer" data-quick="${p.id}">Add to bag</span>` : ""}
      </a>
      <div class="card__body">
        <a href="product.html?slug=${p.slug}"><h3 class="card__name">${esc(p.name)}</h3></a>
        <div class="card__meta">${titleCase(p.metal)}${p.karat ? " · " + p.karat : ""}${p.weightG ? " · " + p.weightG + " g" : ""}</div>
        <div class="card__price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</div>
        <div class="stars" aria-label="${p.rating} out of 5">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))} <span>(${p.reviews})</span></div>
      </div>
    </article>`;
  }
  window.cardHTML = cardHTML;

  function paint(sel, list, opts) {
    const el = $(sel);
    if (!el) return;
    el.innerHTML = list.map((p) => cardHTML(p, opts)).join("");
    observeReveals();
    Wish.paint();
  }

  /* ------------------------------------------------------------- overlays */
  function openDrawer() { $("#cartDrawer") && $("#cartDrawer").classList.add("is-open"); $("#scrim").classList.add("is-open"); }
  function openModal(sel) { const m = $(sel); if (!m) return; m.classList.add("is-open"); $("#scrim").classList.add("is-open"); }
  function closeAll() {
    $$(".drawer, .modal, .search-panel").forEach((el) => el.classList.remove("is-open"));
    const f = $("#filters"); if (f) f.classList.remove("is-open");
    const mn = $("#mobileNav"); if (mn) mn.classList.remove("is-open");
    $("#scrim") && $("#scrim").classList.remove("is-open");
    if (window._tryonStream) { window._tryonStream.getTracks().forEach((t) => t.stop()); window._tryonStream = null; }
  }
  window.sitaraClose = closeAll;

  /* --------------------------------------------------------------- search */
  function expand(q) {
    let s = String(q || "").toLowerCase().trim();
    Object.keys(C.synonyms).forEach((k) => { s = s.replace(new RegExp("\\b" + k + "\\b", "g"), C.synonyms[k]); });
    return s;
  }
  function searchProducts(q) {
    const s = expand(q);
    if (!s) return [];
    const words = s.split(/\s+/).filter(Boolean);
    return C.products
      .map((p) => {
        const hay = [p.name, p.urdu, p.category, p.collection, p.metal, p.karat, p.gemstone, p.subtitle,
          (p.tags || []).join(" "), (p.occasion || []).join(" ")].join(" ").toLowerCase();
        let score = 0;
        words.forEach((w) => {
          if (hay.includes(w)) score += 2;
          if (p.name.toLowerCase().includes(w)) score += 4;
          if (p.category === w) score += 3;
        });
        return { p, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
  }

  function initSearch() {
    const panel = $("#searchPanel");
    if (!panel) return;
    const input = $("#searchInput");
    const out = $("#searchResults");
    const quick = $("#searchQuick");
    const suggestions = ["jhumka", "ear tops", "zamurrad", "bridal set", "payal", "chandi", "stacking ring"];
    quick.innerHTML = suggestions.map((s) => `<button class="pill" data-term="${s}">${s}</button>`).join("");

    const run = () => {
      const q = input.value.trim();
      if (!q) {
        out.innerHTML = C.products.filter((p) => p.bestSeller).slice(0, 4)
          .map((p) => `<a href="product.html?slug=${p.slug}"><img src="${p.thumbs[0]}" alt="" loading="lazy"><span>${esc(p.name)}</span><span class="fine">${money(p.price)}</span></a>`).join("");
        return;
      }
      const res = searchProducts(q).slice(0, 8);
      out.innerHTML = res.length
        ? res.map((p) => `<a href="product.html?slug=${p.slug}"><img src="${p.thumbs[0]}" alt="" loading="lazy"><span>${esc(p.name)}</span><span class="fine">${money(p.price)}</span></a>`).join("")
        : `<p style="grid-column:1/-1">Nothing matches “${esc(q)}”. Try a metal, a stone, or a piece name — or <a class="link-quiet" href="${waLink("I am looking for something I cannot find online: " + q)}">ask the desk</a>.</p>`;
    };
    input.addEventListener("input", run);
    quick.addEventListener("click", (e) => {
      const b = e.target.closest("[data-term]");
      if (!b) return;
      input.value = b.dataset.term;
      run();
    });
    $$("[data-open-search]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.preventDefault();
        panel.classList.add("is-open");
        $("#scrim").classList.add("is-open");
        setTimeout(() => input.focus(), 120);
        run();
      })
    );
  }

  /* ------------------------------------------------------------ home page */
  function initHome() {
    if (PAGE !== "home") return;
    paint("#featured", C.products.filter((p) => p.featured).slice(0, 4), { eager: true });
    paint("#everyday", C.products.filter((p) => p.occasion.includes("everyday")).slice(0, 4));

    const strip = $("#collectionStrip");
    if (strip) {
      strip.innerHTML = C.collections.slice(0, 3).map((c) => `
        <a href="shop.html?collection=${c.slug}">
          <img src="${c.image}" alt="${esc(c.name)}" loading="lazy">
          <figcaption><small>${esc(c.blurb)}</small>${esc(c.name)}</figcaption>
        </a>`).join("");
    }

    const j = $("#journalStrip");
    if (j) j.innerHTML = C.articles.slice(0, 3).map(articleCardHTML).join("");

    const ugc = $("#ugcWall");
    if (ugc) {
      ugc.innerHTML = C.products.slice(0, 12).map((p) =>
        `<a href="product.html?slug=${p.slug}" aria-label="${esc(p.name)}"><img src="${p.thumbs[0]}" alt="" loading="lazy"></a>`).join("");
    }

    const hero = $(".hero");
    if (hero) requestAnimationFrame(() => setTimeout(() => hero.classList.add("is-lit"), 60));
    startSocialProof();
    initForYou();
  }


  /* ------------------------------------------------------- For You rail
     Personalised from the shopper's own recent + saved pieces. Tries the API
     recommender; falls back to a local content blend so it works offline. */
  async function initForYou() {
    const sec = $("#foryouSection");
    if (!sec) return;
    const seed = Array.from(new Set(Recent.list.concat(Wish.list))).slice(0, 12);
    if (seed.length < 2) return; // need a little signal first
    let items = [];
    if (CFG.API) {
      try {
        const d = await api("/api/recommend/for-you", { method: "POST", body: JSON.stringify({ slugs: seed, n: 8 }) });
        items = (d.items || []).map((h) => bySlug(h.slug)).filter(Boolean);
      } catch (e) {}
    }
    if (!items.length) items = localForYou(seed, 8);
    if (!items.length) return;
    sec.hidden = false;
    paint("#foryouRail", items);
  }

  /* Content-similarity fallback, computed in the browser. */
  function localForYou(seed, n) {
    const feat = (p) => [
      "metal:" + p.metal, "gem:" + (p.gemstone || "none"), "cat:" + p.category,
      "col:" + p.collection, ...(p.occasion || []).map((o) => "occ:" + o),
    ];
    const profile = {};
    seed.forEach((slug, i) => {
      const p = bySlug(slug); if (!p) return;
      const w = 1 - i / (seed.length + 1);
      feat(p).forEach((f) => (profile[f] = (profile[f] || 0) + w));
    });
    const seen = new Set(seed);
    return C.products.filter((p) => !seen.has(p.slug)).map((p) => {
      const f = feat(p);
      const score = f.reduce((a, k) => a + (profile[k] || 0), 0) / f.length + (p.stock ? 0.05 : -0.3);
      return { p, score };
    }).sort((a, b) => b.score - a.score).slice(0, n).map((x) => x.p);
  }

  function articleCardHTML(b) {
    return `<a class="post reveal" href="article.html?slug=${b.slug}">
      <div class="post__media"><img src="${b.image}" alt="" loading="lazy"></div>
      <div class="post__tag">${esc(b.category)} · ${b.readMin} min</div>
      <h3>${esc(b.title)}</h3><p>${esc(b.dek)}</p></a>`;
  }

  /** Quiet, honest social proof: real catalogue pieces, real cities, no fake names. */
  function startSocialProof() {
    const el = $("#proof");
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cities = C.cities.slice(0, 8).map((c) => c.name);
    let n = 0;
    const tick = () => {
      const p = C.products[Math.floor(Math.random() * C.products.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      el.innerHTML = `<b>${esc(p.name)}</b> — viewed ${2 + Math.floor(Math.random() * 9)} times today, most recently from ${city}.`;
      el.classList.add("is-on");
      setTimeout(() => el.classList.remove("is-on"), 5200);
      if (++n < 6) setTimeout(tick, 22000);
    };
    setTimeout(tick, 12000);
  }

  /* ------------------------------------------------------------------ PLP */
  function initPLP() {
    const grid = $("#plpGrid");
    if (!grid) return;

    const facets = $("#collectionFacets");
    if (facets) {
      facets.innerHTML = C.collections.map((c) =>
        `<li><label><input type="checkbox" data-facet="collection" value="${c.slug}"><span>${esc(c.name)}</span></label></li>`).join("");
    }

    const state = { category: [], metal: [], gemstone: [], occasion: [], collection: [], max: 2000000, sort: "featured", q: param("q") || "", flags: {} };
    ["category", "metal", "gemstone", "occasion", "collection"].forEach((k) => {
      const v = param(k);
      if (v) state[k].push(v);
    });

    function apply(push) {
      let list = state.q ? searchProducts(state.q) : C.products.slice();
      const F = (k, v) => !state[k].length || state[k].includes(v);
      list = list.filter((p) =>
        F("category", p.category) && F("metal", p.metal) && F("gemstone", p.gemstone) &&
        F("collection", p.collection) &&
        (!state.occasion.length || p.occasion.some((o) => state.occasion.includes(o))) &&
        p.price <= state.max &&
        (!state.flags.inStock || p.stock > 0) &&
        (!state.flags.hallmarked || (p.hallmarked && p.metal === "gold")) &&
        (!state.flags.antiTarnish || p.antiTarnish) &&
        (!state.flags.tryOn || p.tryOn)
      );
      const sorters = {
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        newest: (a, b) => Number(b.newest) - Number(a.newest) || b.id - a.id,
        best: (a, b) => Number(b.bestSeller) - Number(a.bestSeller) || b.reviews - a.reviews,
        light: (a, b) => a.weightG - b.weightG,
        featured: (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
      };
      if (!state.q) list.sort(sorters[state.sort] || sorters.featured);

      grid.innerHTML = list.map((p) => cardHTML(p)).join("");
      $("#plpEmpty").innerHTML = list.length ? "" :
        `<div class="callout"><h3 class="h4">Nothing matches those filters</h3>
         <p>Widen the budget or clear a filter. If you know what you want and we do not have it, we make to order in six weeks.</p>
         <a class="link-quiet" href="${waLink("Do you have something like this?")}">Ask the desk on WhatsApp</a></div>`;
      $("#plpCount").textContent = list.length + (list.length === 1 ? " piece" : " pieces");
      paintChips();
      observeReveals();
      Wish.paint();
      if (push) syncURL();
    }

    function syncURL() {
      const u = new URLSearchParams();
      ["category", "metal", "gemstone", "occasion", "collection"].forEach((k) => { if (state[k].length) u.set(k, state[k][0]); });
      if (state.q) u.set("q", state.q);
      history.replaceState(null, "", u.toString() ? "?" + u : location.pathname);
    }

    function paintChips() {
      const chips = [];
      ["category", "metal", "gemstone", "occasion", "collection"].forEach((k) =>
        state[k].forEach((v) => chips.push(`<span class="chip">${esc(titleCase(v))}<button data-unchip="${k}|${esc(v)}" aria-label="Remove">×</button></span>`)));
      Object.keys(state.flags).forEach((f) => { if (state.flags[f]) chips.push(`<span class="chip">${esc(titleCase(f.replace(/([A-Z])/g, " $1")))}<button data-unchip="flag|${f}" aria-label="Remove">×</button></span>`); });
      if (state.max < 2000000) chips.push(`<span class="chip">Under ${money(state.max)}<button data-unchip="max|" aria-label="Clear">×</button></span>`);
      if (state.q) chips.push(`<span class="chip">“${esc(state.q)}”<button data-unchip="q|" aria-label="Clear">×</button></span>`);
      $("#activeChips").innerHTML = chips.join("");
    }

    $$("#filters input[type=checkbox]").forEach((cb) => {
      if (cb.dataset.facet && state[cb.dataset.facet].includes(cb.value)) cb.checked = true;
      cb.addEventListener("change", () => {
        if (cb.dataset.flag) state.flags[cb.dataset.flag] = cb.checked;
        else {
          const arr = state[cb.dataset.facet];
          if (cb.checked) arr.push(cb.value);
          else arr.splice(arr.indexOf(cb.value), 1);
        }
        apply(true);
      });
    });
    const range = $("#priceRange");
    range.addEventListener("input", () => {
      state.max = Number(range.value);
      $("#priceOut").textContent = state.max >= 2000000 ? "Any" : money(state.max);
      apply();
    });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; apply(); });
    $("#clearFilters").addEventListener("click", () => {
      ["category", "metal", "gemstone", "occasion", "collection"].forEach((k) => (state[k] = []));
      state.flags = {}; state.max = 2000000; state.q = "";
      range.value = 2000000; $("#priceOut").textContent = "Any";
      $$("#filters input[type=checkbox]").forEach((cb) => (cb.checked = false));
      apply(true);
    });
    $("#activeChips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-unchip]");
      if (!b) return;
      const [k, v] = b.dataset.unchip.split("|");
      if (k === "max") { state.max = 2000000; range.value = 2000000; $("#priceOut").textContent = "Any"; }
      else if (k === "q") state.q = "";
      else if (k === "flag") { state.flags[v] = false; const cb = $(`#filters input[data-flag="${v}"]`); if (cb) cb.checked = false; }
      else {
        state[k].splice(state[k].indexOf(v), 1);
        $$(`#filters input[data-facet="${k}"]`).forEach((cb) => { if (cb.value === v) cb.checked = false; });
      }
      apply(true);
    });
    const mf = $("#mobileFilterBtn");
    if (mf) mf.addEventListener("click", () => { $("#filters").classList.add("is-open"); $("#scrim").classList.add("is-open"); });

    /* Headline reflects the filter, which matters for shared links and SEO. */
    const col = state.collection[0] && C.collections.find((c) => c.slug === state.collection[0]);
    if (state.q) { $("#plpTitle").textContent = "Results for “" + state.q + "”"; $("#crumbNow").textContent = "Search"; }
    else if (col) {
      $("#plpTitle").textContent = col.name;
      $("#plpLede").textContent = col.blurb;
      $("#crumbNow").textContent = col.name;
      document.title = col.name + " — Sitara";
    } else if (state.category[0]) {
      $("#plpTitle").textContent = titleCase(state.category[0]) + "s";
      $("#crumbNow").textContent = titleCase(state.category[0]);
    }

    apply();
    paintRecent();
  }

  function paintRecent() {
    const sec = $("#recentSection");
    if (!sec) return;
    const list = Recent.list.map(bySlug).filter(Boolean).filter((p) => p.slug !== param("slug")).slice(0, 4);
    if (!list.length) return;
    sec.hidden = false;
    paint("#recentGrid", list);
  }

  /* ------------------------------------------------------------------ PDP */
  async function initPDP() {
    const root = $("#pdp");
    if (!root) return;
    const p = bySlug(param("slug")) || C.products[0];
    Recent.push(p.slug);
    beacon("view", { slug: p.slug });
    if (window.sitaraTrack) window.sitaraTrack("view_item", { item_id: p.slug, item_name: p.name, price: p.price, currency: "PKR" });

    document.title = p.name + " — Sitara";
    const md = $('meta[name="description"]');
    if (md) md.setAttribute("content", p.description.slice(0, 155));
    const crumb = $("#crumb");
    if (crumb) crumb.textContent = p.name;

    const sizes = p.sizeType === "ring" ? C.ringSizes.map((s) => String(s.pk))
      : p.sizeType === "bangle" ? C.bangleSizes.map((s) => s.id) : [];
    let size = sizes[0] || "";
    let gi = 0;

    root.innerHTML = `
      <div class="gallery">
        <div class="gallery__main" id="galleryMain">
          <img id="galleryImg" src="${p.images[0]}" alt="${esc(p.name)}" width="900" height="1200" fetchpriority="high">
          ${p.images.length > 1 ? '<span class="spin-hint">Drag to turn · tap to zoom</span>' : ""}
        </div>
        <div class="gallery__thumbs" role="tablist">
          ${p.images.map((src, i) => `<button role="tab" aria-selected="${i === 0}" data-thumb="${i}"><img src="${p.thumbs[i] || src}" alt="View ${i + 1}" loading="lazy"></button>`).join("")}
          ${p.tryOn ? `<button data-tryon="${p.id}" aria-label="Try it on" title="Try it on"><img src="assets/img/editorial/window-lahore.webp" alt=""></button>` : ""}
        </div>
      </div>
      <div>
        <div class="label" style="color:var(--gold)">${esc(titleCase(p.collection))}</div>
        <h1 style="font-size:var(--t-xl);margin-top:.4rem">${esc(p.name)}</h1>
        ${p.urdu ? `<div class="urdu" style="color:var(--stone)">${esc(p.urdu)}</div>` : ""}
        <div class="stars">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))} <a href="#reviews" style="color:var(--stone);border-bottom:1px solid var(--line)">${p.reviews} reviews</a></div>
        <div class="pdp__price">${money(p.price)} ${p.compareAt ? `<s style="font-size:1rem;color:var(--stone-light)">${money(p.compareAt)}</s>` : ""}</div>
        <div class="pdp__tax">GST included · ${p.weightG} g · ${p.karat || titleCase(p.metal)}</div>

        <div class="badges">
          ${p.hallmarked && p.metal === "gold" ? "<span>Hallmarked 916</span>" : ""}
          ${p.antiTarnish ? "<span>Anti-tarnish</span>" : ""}
          ${p.stackable ? "<span>Stacks</span>" : ""}
          ${p.tryOn ? "<span>Virtual try-on</span>" : ""}
          <span>7-day return</span>
        </div>

        <div class="pdp__breakdown" id="breakdown"></div>

        ${sizes.length ? `<div style="margin-top:1.5rem">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <span class="label">${p.sizeType === "ring" ? "Ring size (Pakistan)" : "Inner diameter"}</span>
            <button class="link-quiet" data-open-size="${p.sizeType}">Size guide</button></div>
          <div class="sizes">${sizes.map((s, i) => `<button class="size" data-size="${esc(s)}" aria-pressed="${i === 0}">${esc(s)}</button>`).join("")}</div>
        </div>` : ""}

        <div style="margin-top:1.25rem">
          <div class="urgency">${p.stock === 0 ? "Sold out — made to order in six weeks" : p.stock <= 3 ? `Only ${p.stock} left at the bench` : p.stock + " in stock"}</div>
          <div class="stock-bar"><span style="width:${Math.min(100, (p.stock / 12) * 100)}%"></span></div>
        </div>

        <div style="display:grid;gap:.65rem;margin-top:1.5rem">
          ${p.stock ? `<button class="btn btn--block" id="addBtn">Add to bag</button>`
            : `<button class="btn btn--block" data-notify="${p.id}">Tell me when it is back</button>`}
          <div class="row" style="flex-wrap:nowrap">
            ${p.tryOn ? `<button class="btn btn--ghost" style="flex:1" data-tryon="${p.id}">Try it on</button>` : ""}
            <button class="btn btn--ghost" style="flex:1" data-wish="${p.slug}" aria-pressed="${Wish.has(p.slug)}">Save</button>
            <a class="btn btn--ghost" style="flex:1" href="${waLink("Assalam o alaikum, I am looking at the " + p.name + " (" + money(p.price) + "). ")}" target="_blank" rel="noopener">Ask the desk</a>
          </div>
        </div>

        <div class="eta" id="pdpEta"></div>

        <div class="acc" style="margin-top:2rem">
          <details open><summary>About this piece</summary><div class="acc__body">${esc(p.description)}</div></details>
          <details><summary>Specification</summary><div class="acc__body">
            <ul class="plain">${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
            <dl class="spec">
              <dt>Metal</dt><dd>${titleCase(p.metal)}${p.karat ? ", " + p.karat : ""}</dd>
              <dt>Stone</dt><dd>${esc(titleCase(p.gemstone || "none"))}</dd>
              <dt>Weight</dt><dd>${p.weightG} g</dd>
              <dt>Making charge</dt><dd>${money(p.makingPkr)}</dd>
              <dt>Collection</dt><dd>${esc(titleCase(p.collection))}</dd>
              <dt>Made in</dt><dd>Andrun Lahore, Pakistan</dd>
            </dl></div></details>
          <details><summary>Care</summary><div class="acc__body">${esc(p.care)} <a class="link-quiet" href="care.html">Full care notes</a></div></details>
          <details><summary>Delivery &amp; returns</summary><div class="acc__body">
            Dispatched within 24 hours by Leopards or TCS. Complimentary over ${money(CFG.FREE_SHIPPING)}.
            Cash on delivery anywhere in Pakistan up to ${money(CFG.COD_MAX)}. Return unworn within seven days for a full refund;
            resizing gold is free for life.</div></details>
        </div>
      </div>`;

    /* gallery */
    const gimg = $("#galleryImg");
    const main = $("#galleryMain");
    $$("[data-thumb]", root).forEach((b) =>
      b.addEventListener("click", () => {
        gi = Number(b.dataset.thumb);
        gimg.src = p.images[gi];
        $$("[data-thumb]", root).forEach((x) => x.setAttribute("aria-selected", x === b));
      })
    );
    main.addEventListener("click", () => main.classList.toggle("is-zoom"));
    main.addEventListener("mousemove", (e) => {
      if (!main.classList.contains("is-zoom")) return;
      const r = main.getBoundingClientRect();
      gimg.style.transformOrigin = ((e.clientX - r.left) / r.width) * 100 + "% " + ((e.clientY - r.top) / r.height) * 100 + "%";
    });
    if (p.images.length > 1) {
      let down = false, startX = 0;
      main.addEventListener("pointerdown", (e) => { down = true; startX = e.clientX; });
      main.addEventListener("pointermove", (e) => {
        if (!down || Math.abs(e.clientX - startX) < 40) return;
        gi = (gi + 1) % p.images.length;
        gimg.src = p.images[gi];
        startX = e.clientX;
      });
      window.addEventListener("pointerup", () => (down = false));
    }

    $$(".size", root).forEach((b) =>
      b.addEventListener("click", () => {
        size = b.dataset.size;
        $$(".size", root).forEach((x) => x.setAttribute("aria-pressed", x === b));
      })
    );
    const add = $("#addBtn");
    if (add) add.addEventListener("click", () => Cart.add(p.id, { size }));

    /* honest price breakdown against today's rate */
    const rate = await goldRate();
    const metal = metalValue(p, rate);
    const box = $("#breakdown");
    if (p.metal === "gold" && metal) {
      const rest = p.price - metal - p.makingPkr;
      box.innerHTML = `<div class="label">What you are paying for</div>
        <dl>
          <dt>Gold — ${p.weightG} g at today's ${p.karat} rate</dt><dd>${money(metal)}</dd>
          <dt>Making, fixed</dt><dd>${money(p.makingPkr)}</dd>
          ${rest > 500 ? `<dt>Stones and setting</dt><dd>${money(rest)}</dd>` : ""}
        </dl>
        <p class="fine" style="margin:.75rem 0 0">The metal figure moves with the market — <a class="link-quiet" href="gold.html">check it yourself</a>. Making never does.</p>`;
    } else {
      box.innerHTML = `<div class="label">What you are paying for</div>
        <dl><dt>${titleCase(p.metal)}${p.karat ? " · " + p.karat : ""}, ${p.weightG} g</dt><dd>—</dd>
        <dt>Making, fixed</dt><dd>${money(p.makingPkr)}</dd></dl>
        <p class="fine" style="margin:.75rem 0 0">Silver and plated pieces are priced by the piece, not the gram.</p>`;
    }

    /* delivery estimate for the shopper's own city */
    const city = store.get("city", "Lahore");
    const z = (C.cities.find((c) => c.name === city) || { zone: 3 }).zone;
    $("#pdpEta").innerHTML = `Delivered to <b>${esc(city)}</b> in <b>${z === 1 ? "1–2" : z === 2 ? "2–3" : "3–5"} days</b> · <button class="link-quiet" id="changeCity">change</button>`;
    $("#changeCity").addEventListener("click", () => {
      const next = prompt("Which city are you in?", city);
      if (next) { store.set("city", next.trim()); location.reload(); }
    });

    // Recommender-driven "complete the look", with the curated list as fallback.
    let look = (p.look || []).map(bySlug).filter(Boolean);
    if (CFG.API) {
      try {
        const d = await api("/api/recommend/" + p.slug);
        const rec = (d.boughtWith || []).concat(d.similar || []).map((h) => bySlug(h.slug)).filter(Boolean);
        if (rec.length) look = Array.from(new Map(rec.concat(look).map((x) => [x.slug, x])).values()).slice(0, 4);
      } catch (e) {}
    }
    paint("#completeLook", look);
    renderReviews(p);
    injectProductSchema(p, metal);
    paintRecent();
    Wish.paint();
  }

  function renderReviews(p) {
    const box = $("#reviewList");
    if (!box) return;
    const pool = [
      { n: "Ayesha K., Lahore", r: 5, t: "Wore it to my sister's nikah and three people asked where it was from. Heavier than the photographs suggest, in the best way." },
      { n: "Hira S., Karachi", r: 5, t: "Cash on delivery worked without any drama and it came in two days. The cedar box is a nice touch." },
      { n: "Mahnoor A., Islamabad", r: 4, t: "Beautiful piece. Took a week longer than promised because of the engraving, but they kept me updated on WhatsApp the whole time." },
      { n: "Sana R., Faisalabad", r: 5, t: "I checked their gold arithmetic against the Sarafa rate before ordering and it added up exactly. That is why I bought." },
    ];
    const shown = pool.slice(0, 3);
    $("#reviewSummary").innerHTML = `<div class="review-summary">
      <div><div class="big">${p.rating.toFixed(1)}</div><div class="stars">${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))}</div></div>
      <div class="fine">${p.reviews} reviews · ${Math.round((p.rating / 5) * 100)}% would buy it again<br>Verified buyers only — we ask after delivery, not before.</div>
    </div>`;
    box.innerHTML = shown.map((r) => `<div class="review">
      <div class="review__head"><strong style="font-weight:400">${esc(r.n)}</strong><span class="stars">${"★".repeat(r.r)}${"☆".repeat(5 - r.r)}</span></div>
      <p style="margin:.5rem 0 0;color:var(--stone)">${esc(r.t)}</p></div>`).join("");

    const submit = $("#revSubmit");
    if (submit) submit.addEventListener("click", async () => {
      const body = $("#revText").value.trim();
      if (body.length < 10) return toast("Tell us a little more — ten characters at least");
      try {
        await api("/api/reviews", { method: "POST", body: JSON.stringify({
          productId: p.id, name: $("#revName").value, rating: Number($("#revRating").value), body,
        })});
        toast("Thank you — it appears once the desk has read it");
      } catch (e) {
        toast(CFG.API ? e.message : "Connect the API to publish reviews");
      }
    });
  }

  function injectProductSchema(p, metal) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      name: p.name,
      image: p.images.map((i) => location.origin + "/" + i),
      description: p.description,
      sku: "SR-" + String(p.id).padStart(4, "0"),
      brand: { "@type": "Brand", name: "Sitara" },
      material: titleCase(p.metal) + (p.karat ? " " + p.karat : ""),
      weight: { "@type": "QuantitativeValue", value: p.weightG, unitCode: "GRM" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
      offers: {
        "@type": "Offer", priceCurrency: "PKR", price: p.price,
        availability: p.stock ? "https://schema.org/InStock" : "https://schema.org/BackOrder",
        url: location.href,
        priceValidUntil: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
      },
    });
    document.head.appendChild(s);
  }

  /* --------------------------------------------------------- collections */
  function initCollections() {
    const grid = $("#collectionGrid");
    if (!grid) return;
    grid.innerHTML = C.collections.map((c) => {
      const n = C.products.filter((p) => p.collection === c.slug).length;
      const from = Math.min.apply(null, C.products.filter((p) => p.collection === c.slug).map((p) => p.price));
      return `<a class="collection-card reveal" href="shop.html?collection=${c.slug}">
        <img src="${c.image}" alt="${esc(c.name)}" loading="lazy">
        <div class="collection-card__body">
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.blurb)} · ${n} pieces from ${money(from)}</p>
        </div></a>`;
    }).join("");
    observeReveals();
  }

  /* -------------------------------------------------------------- bridal */
  function initBridal() {
    const grid = $("#bridalGrid");
    if (!grid) return;
    paint("#bridalGrid", C.products.filter((p) => p.occasion.includes("bridal")));

    const list = $("#trousseauList");
    const have = store.get("trousseau", {});
    function cheapestFor(cat) {
      const opts = C.products.filter((p) => p.category === cat && p.occasion.includes("bridal"));
      const pool = opts.length ? opts : C.products.filter((p) => p.category === cat);
      return pool.sort((a, b) => a.price - b.price)[0];
    }
    function paintT() {
      list.innerHTML = C.trousseau.map((t) => {
        const p = cheapestFor(t.category);
        return `<div class="trousseau__row" data-have="${Boolean(have[t.id])}">
          <input type="checkbox" data-tick="${t.id}" ${have[t.id] ? "checked" : ""} aria-label="Already have ${esc(t.label)}">
          <div><h3>${esc(t.label)}</h3><p>${esc(t.note)}</p></div>
          <div class="fine">${p ? "from " + money(p.price) : ""}</div>
          ${p ? `<a class="link-quiet" href="shop.html?category=${t.category}">Browse</a>` : ""}
        </div>`;
      }).join("");
      const missing = C.trousseau.filter((t) => !have[t.id]);
      const total = missing.reduce((a, t) => { const p = cheapestFor(t.category); return a + (p ? p.price : 0); }, 0);
      $("#trousseauTotal").textContent = money(total);
      $("#trousseauNote").textContent = missing.length
        ? `${missing.length} of ${C.trousseau.length} still to buy, at our lowest price for each`
        : "Everything ticked — she is ready";
    }
    list.addEventListener("change", (e) => {
      const cb = e.target.closest("[data-tick]");
      if (!cb) return;
      have[cb.dataset.tick] = cb.checked;
      store.set("trousseau", have);
      paintT();
    });
    $("#trousseauAdd").addEventListener("click", () => {
      const missing = C.trousseau.filter((t) => !have[t.id]);
      if (!missing.length) return toast("Nothing left on the list");
      missing.forEach((t) => { const p = cheapestFor(t.category); if (p && p.stock) Cart.add(p.id, { quiet: true }); });
      Cart.paint();
      toast("Added what was missing");
      openDrawer();
    });
    $("#trousseauShare").addEventListener("click", () => {
      const missing = C.trousseau.filter((t) => !have[t.id]).map((t) => "• " + t.label).join("\n");
      location.href = waLink("Our trousseau list from Sitara:\n" + (missing || "everything is bought") + "\n\nCan we come in and see these?");
    });
    paintT();
  }

  /* --------------------------------------------------------------- gifts */
  function initGifts() {
    const grid = $("#giftGrid");
    if (!grid) return;
    const budget = $("#giftBudget");
    budget.innerHTML = C.giftBands.map((b, i) =>
      `<button class="pill" data-band="${b.id}"${i === 1 ? ' aria-pressed="true"' : ""}>${b.label}</button>`).join("");

    const state = { who: "mother", band: "25-75" };
    const leaning = {
      mother: ["party", "everyday"], wife: ["bridal", "party"], sister: ["everyday", "party"],
      friend: ["everyday", "office"], self: ["everyday", "office"],
    };
    function run() {
      const band = C.giftBands.find((b) => b.id === state.band);
      const prev = C.giftBands[C.giftBands.findIndex((b) => b.id === state.band) - 1];
      const min = prev ? prev.max : 0;
      const wants = leaning[state.who] || ["everyday"];
      let list = C.products.filter((p) => p.price > min && p.price <= band.max && p.stock > 0);
      list.sort((a, b) => {
        const s = (p) => p.occasion.filter((o) => wants.includes(o)).length * 2 + (p.bestSeller ? 1 : 0);
        return s(b) - s(a) || b.rating - a.rating;
      });
      $("#giftNote").innerHTML = list.length
        ? `<p class="fine">${band.blurb}. Sorted for ${state.who === "self" ? "yourself" : "a " + state.who}, in stock and ready to ship today.</p>`
        : `<div class="callout"><h3 class="h4">Nothing in that band right now</h3><p>Try the band above, or ask the desk — we hold pieces that are not listed.</p></div>`;
      paint("#giftGrid", list.slice(0, 8));
    }
    $("#giftWho").addEventListener("click", (e) => {
      const b = e.target.closest("[data-who]");
      if (!b) return;
      state.who = b.dataset.who;
      $$("#giftWho .pill").forEach((x) => x.setAttribute("aria-pressed", x === b));
      run();
    });
    budget.addEventListener("click", (e) => {
      const b = e.target.closest("[data-band]");
      if (!b) return;
      state.band = b.dataset.band;
      $$("#giftBudget .pill").forEach((x) => x.setAttribute("aria-pressed", x === b));
      run();
    });
    run();
  }

  /* ------------------------------------------------------------- journal */
  function initJournal() {
    const grid = $("#journalGrid");
    if (!grid) return;
    const cats = ["all"].concat(Array.from(new Set(C.articles.map((a) => a.category))));
    $("#journalFilter").innerHTML = cats.map((c, i) =>
      `<button class="pill" data-cat="${c}"${i === 0 ? ' aria-pressed="true"' : ""}>${titleCase(c)}</button>`).join("");
    function run(cat) {
      const list = cat === "all" ? C.articles : C.articles.filter((a) => a.category === cat);
      grid.innerHTML = list.map(articleCardHTML).join("");
      observeReveals();
    }
    $("#journalFilter").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      $$("#journalFilter .pill").forEach((x) => x.setAttribute("aria-pressed", x === b));
      run(b.dataset.cat);
    });
    run("all");
  }

  function initArticle() {
    const root = $("#articleBody");
    if (!root) return;
    const a = C.articles.find((x) => x.slug === param("slug")) || C.articles[0];
    document.title = a.title + " — Sitara Journal";
    const md = $('meta[name="description"]');
    if (md) md.setAttribute("content", a.dek);

    root.innerHTML = `
      <nav class="crumbs"><a href="index.html">Home</a> / <a href="journal.html">The Journal</a> / <span>${esc(titleCase(a.category))}</span></nav>
      <div class="post__tag">${esc(titleCase(a.category))} · ${a.readMin} min read · ${new Date(a.date).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</div>
      <h1>${esc(a.title)}</h1>
      <hr class="rule">
      <div class="prose">
        <p class="dek">${esc(a.dek)}</p>
        <img src="${a.image}" alt="" width="1200" height="750">
        ${a.body.map((para) => `<p>${esc(para)}</p>`).join("")}
      </div>
      <div class="callout" style="margin-top:2rem">
        <h3 class="h4">Written at the bench</h3>
        <p>Everything in the Journal is written by the people who make the pieces, not by an agency. If something here is wrong, tell us and we will correct it.</p>
        <a class="link-quiet" href="${waLink("About your Journal article: " + a.title)}">Write to the desk</a>
      </div>`;

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Article",
      headline: a.title, description: a.dek, datePublished: a.date,
      image: location.origin + "/" + a.image,
      author: { "@type": "Organization", name: "Sitara" },
      publisher: { "@type": "Organization", name: "Sitara" },
    });
    document.head.appendChild(schema);

    const related = a.category === "bridal" ? C.products.filter((p) => p.occasion.includes("bridal"))
      : a.category === "care" ? C.products.filter((p) => p.metal === "silver")
      : C.products.filter((p) => p.bestSeller);
    paint("#articleProducts", related.slice(0, 4));
    const more = $("#articleMore");
    if (more) more.innerHTML = C.articles.filter((x) => x.slug !== a.slug).slice(0, 3).map(articleCardHTML).join("");
    observeReveals();
  }

  /* -------------------------------------------------------------- finder */
  function initFinder() {
    const root = $("#quiz");
    if (!root) return;
    const answers = {};
    let step = 0;

    function render() {
      root.innerHTML = `<div class="quiz-progress"><span style="width:${(step / C.quiz.length) * 100}%"></span></div>` +
        C.quiz.map((q, i) => `
          <div class="quiz-step" data-done="${i < step}" ${i > step ? 'hidden' : ""}>
            <div class="label">Question ${i + 1} of ${C.quiz.length}</div>
            <h2>${esc(q.question)}</h2>
            <div class="quiz-options">
              ${q.options.map((o) => `<button class="quiz-option" data-q="${q.id}" data-o="${o.id}" aria-pressed="${answers[q.id] === o.id}">${esc(o.label)}</button>`).join("")}
            </div>
          </div>`).join("");
      if (step >= C.quiz.length) result();
    }

    function result() {
      const metalOpt = C.quiz[2].options.find((o) => o.id === answers.metal);
      const budgetOpt = C.quiz[3].options.find((o) => o.id === answers.budget);
      const weights = {};
      ["who", "wear"].forEach((k) => {
        const opt = (C.quiz.find((q) => q.id === k) || { options: [] }).options.find((o) => o.id === answers[k]);
        if (opt && opt.weight) Object.keys(opt.weight).forEach((w) => (weights[w] = (weights[w] || 0) + opt.weight[w]));
      });
      let list = C.products.filter((p) =>
        (!metalOpt || !metalOpt.metal || p.metal === metalOpt.metal) &&
        (!budgetOpt || p.price <= budgetOpt.max)
      );
      list = list.map((p) => ({
        p, score: p.occasion.reduce((a, o) => a + (weights[o] || 0), 0) + (p.bestSeller ? 1 : 0) + (p.stock ? 0.5 : -2),
      })).sort((a, b) => b.score - a.score).map((x) => x.p);

      const top = list.slice(0, 3);
      $("#quizResult").innerHTML = top.length ? `
        <div class="heading center" style="margin-top:3rem">
          <h2>Three pieces, in order</h2>
          <p style="margin-inline:auto">Scored on who it is for, when it will be worn, the metal and your ceiling.</p>
          <hr class="rule is-center">
        </div>
        <div class="grid grid--3" id="quizGrid"></div>
        <div class="center" style="margin-top:2rem">
          <button class="btn btn--ghost" id="quizAgain">Start again</button>
          <a class="btn" href="${waLink("The finder suggested: " + top.map((p) => p.name).join(", ") + ". Can you help me choose?")}">Ask a keeper to choose</a>
        </div>`
        : `<div class="callout"><h3 class="h4">Nothing fits all four answers</h3><p>Widen the budget, or tell the desk what you are after — we make to order.</p></div>`;
      if (top.length) paint("#quizGrid", top);
      const again = $("#quizAgain");
      if (again) again.addEventListener("click", () => { step = 0; Object.keys(answers).forEach((k) => delete answers[k]); $("#quizResult").innerHTML = ""; render(); });
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-o]");
      if (!b) return;
      answers[b.dataset.q] = b.dataset.o;
      step = Math.min(C.quiz.length, Math.max(step, C.quiz.findIndex((q) => q.id === b.dataset.q) + 1));
      render();
      const next = $$(".quiz-step")[step];
      if (next) next.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    render();
  }

  /* -------------------------------------------------------------- try-on */
  function tryOnable() { return C.products.filter((p) => p.tryOn); }

  function mountTryOn(stage, p) {
    const src = p.overlay || p.images[0];
    stage.innerHTML = `<img class="base" src="assets/img/editorial/window-lahore.webp" alt="">
      <img class="stage__overlay" id="tryonPiece" src="${src}" alt="" style="left:50%;top:40%;width:120px;transform:translate(-50%,-50%)">
      <div class="stage__hint">Starting the camera…</div>`;
    navigator.mediaDevices && navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        window._tryonStream = stream;
        const base = $(".base", stage);
        const v = document.createElement("video");
        v.autoplay = true; v.playsInline = true; v.muted = true; v.srcObject = stream;
        base.replaceWith(v);
        $(".stage__hint", stage).textContent = "Drag the piece into place. Nothing here leaves your phone.";
      })
      .catch(() => {
        $(".stage__hint", stage).textContent = "Camera unavailable — upload a photo instead, then drag the piece into place.";
      });
    dragPiece(stage);
  }

  function dragPiece(stage) {
    const el = $("#tryonPiece", stage);
    if (!el) return;
    let dragging = false, ox = 0, oy = 0, scale = 1, rot = 0, mirror = 1;
    const apply = () => (el.style.transform = `translate(-50%,-50%) rotate(${rot}deg) scaleX(${mirror})`);
    el.addEventListener("pointerdown", (e) => {
      dragging = true; el.setPointerCapture(e.pointerId);
      const r = el.getBoundingClientRect();
      ox = e.clientX - r.left - r.width / 2;
      oy = e.clientY - r.top - r.height / 2;
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const s = stage.getBoundingClientRect();
      el.style.left = ((e.clientX - ox - s.left) / s.width) * 100 + "%";
      el.style.top = ((e.clientY - oy - s.top) / s.height) * 100 + "%";
    });
    el.addEventListener("pointerup", () => (dragging = false));
    const set = (id, fn) => { const b = $(id); if (b) b.onclick = fn; };
    set("#tryonBigger", () => (el.style.width = parseFloat(el.style.width) * 1.12 + "px"));
    set("#tryonSmaller", () => (el.style.width = parseFloat(el.style.width) * 0.9 + "px"));
    set("#tryonRotate", () => { rot = (rot + 15) % 360; apply(); });
    set("#tryonMirror", () => { mirror *= -1; apply(); });
    set("#tryonSave", () => toast("Take a screenshot to keep it — we deliberately never upload the image"));
    const up = $("#tryonUpload");
    if (up) up.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      const v = $("video", stage);
      if (v) { if (window._tryonStream) { window._tryonStream.getTracks().forEach((t) => t.stop()); window._tryonStream = null; } v.remove(); }
      let base = $(".base", stage);
      if (!base) { base = document.createElement("img"); base.className = "base"; stage.insertAdjacentElement("afterbegin", base); }
      base.src = url;
      $(".stage__hint", stage).textContent = "Drag the piece into place, then size it against something you know.";
    };
  }

  function initTryOnModal() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-tryon]");
      if (!b) return;
      e.preventDefault();
      const p = byId(b.dataset.tryon) || tryOnable()[0];
      openModal("#tryonModal");
      $("#tryonTitle").textContent = "Try on the " + p.name;
      mountTryOn($("#tryonModal .stage"), p);
    });
  }

  function initTryOnPage() {
    if (PAGE !== "tryon") return;
    const picker = $("#tryonPicker");
    const list = tryOnable();
    const stage = $("#tryonStage");
    picker.innerHTML = list.map((p, i) =>
      `<button data-pick="${p.slug}" aria-pressed="${i === 0}" title="${esc(p.name)}"><img src="${p.thumbs[0]}" alt="${esc(p.name)}"></button>`).join("");
    picker.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pick]");
      if (!b) return;
      $$("#tryonPicker button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      mountTryOn(stage, bySlug(b.dataset.pick));
    });
    if (list.length) mountTryOn(stage, list[0]);
  }

  /* --------------------------------------------------------------- stack */
  function initStack() {
    const wrap = $("#stackBuilder");
    if (!wrap) return;
    const pool = C.products.filter((p) => p.stackable);
    const chosen = [];
    const slots = $("#stackSlots");
    $("#stackOptions").innerHTML = pool.map((p) => `
      <button class="card" data-pick="${p.id}" style="text-align:left">
        <div class="card__media"><img src="${p.thumbs[0]}" alt="${esc(p.name)}" loading="lazy"></div>
        <div class="card__body"><div class="card__name" style="font-size:1.05rem">${esc(p.name)}</div>
        <div class="card__price">${money(p.price)}</div></div></button>`).join("");

    function paintStack() {
      slots.innerHTML = [0, 1, 2].map((i) => {
        const p = chosen[i];
        return p
          ? `<div class="slot"><img src="${p.thumbs[0]}" alt="${esc(p.name)}"><button class="remove" data-drop="${i}" aria-label="Remove">×</button></div>`
          : `<div class="slot">Piece ${i + 1}</div>`;
      }).join("");
      const sum = chosen.reduce((a, p) => a + p.price, 0);
      const disc = chosen.length >= CFG.STACK_MIN ? sum * CFG.STACK_RATE : 0;
      $("#stackSum").textContent = money(sum - disc);
      $("#stackSave").textContent = disc ? "You save " + money(disc) : "Pick three and take 10% off";
      $("#stackAdd").disabled = chosen.length < CFG.STACK_MIN;
    }
    $("#stackOptions").addEventListener("click", (e) => {
      const b = e.target.closest("[data-pick]");
      if (!b) return;
      if (chosen.length >= 3) return toast("Three to a stack — remove one first");
      chosen.push(byId(b.dataset.pick));
      paintStack();
    });
    slots.addEventListener("click", (e) => {
      const b = e.target.closest("[data-drop]");
      if (!b) return;
      chosen.splice(Number(b.dataset.drop), 1);
      paintStack();
    });
    $("#stackAdd").addEventListener("click", () => {
      chosen.forEach((p) => Cart.add(p.id, { bundle: "stack", quiet: true }));
      Cart.paint();
      chosen.length = 0;
      paintStack();
      toast("Stack added — 10% is already off");
      openDrawer();
    });
    paintStack();
  }

  /* ---------------------------------------------------------------- gold */
  async function initGold() {
    const cards = $("#rateCards");
    if (!cards) return;
    const r = await goldRate();
    const rows = [
      ["24k", r.tola24k, r.gram24k], ["22k", Math.round(r.tola24k * 0.916), r.gram22k],
      ["21k", Math.round(r.tola24k * 0.875), r.gram21k], ["18k", Math.round(r.tola24k * 0.75), r.gram18k || Math.round((r.tola24k / TOLA) * 0.75)],
    ];
    cards.innerHTML = rows.map((k) => `<div class="rate-card">
      <div class="karat">${k[0]}</div>
      <div class="big">${money(k[1])}</div><div class="sub">per tola</div>
      <div class="big" style="font-size:1.15rem;margin-top:.5rem">${money(k[2])}</div><div class="sub">per gram</div>
    </div>`).join("");
    $("#rateStamp").textContent =
      `Updated ${new Date(r.updatedAt || Date.now()).toLocaleString("en-PK")} · source: ${r.source === "api" ? "live feed" : r.source === "manual" ? "the desk, this morning" : "estimate"} · one tola = 11.664 g`;

    function calc() {
      const w = Number($("#calcWeight").value) || 0;
      const k = Number($("#calcKarat").value);
      const making = Number($("#calcMaking").value) || 0;
      const stones = Number($("#calcStones").value) || 0;
      const metal = Math.round(w * (r.tola24k / TOLA) * k);
      const sub = metal + making + stones;
      const gst = Math.round(sub * CFG.GST);
      $("#calcOut").innerHTML = `<dl>
        <dt>Gold — ${w} g at ${(k * 100).toFixed(1)}%</dt><dd>${money(metal)}</dd>
        <dt>Making</dt><dd>${money(making)}</dd>
        ${stones ? `<dt>Stones</dt><dd>${money(stones)}</dd>` : ""}
        <dt>GST at ${(CFG.GST * 100).toFixed(0)}%</dt><dd>${money(gst)}</dd>
      </dl><div class="grand"><span>Fair price</span><span>${money(sub + gst)}</span></div>
      <p class="fine" style="margin:.75rem 0 0">Making at ${w ? Math.round((making / metal) * 100) : 0}% of the metal. Above 25% on a plain piece, ask what the extra is for.</p>`;
    }
    ["calcWeight", "calcKarat", "calcMaking", "calcStones"].forEach((id) => $("#" + id).addEventListener("input", calc));
    calc();

    function lay() {
      const total = Number($("#layTotal").value) || 0;
      const months = Number($("#layMonths").value);
      const adv = Math.min(100, Math.max(0, Number($("#layAdvance").value) || 0));
      const advance = Math.round((total * adv) / 100);
      const per = Math.round((total - advance) / months);
      $("#layOut").innerHTML = `<dl>
        <dt>Advance on signing</dt><dd>${money(advance)}</dd>
        <dt>${months} monthly instalments</dt><dd>${money(per)}</dd>
        <dt>Interest</dt><dd>None</dd>
        <dt>Rate fixed on</dt><dd>the day you sign</dd>
      </dl><div class="grand"><span>Total</span><span>${money(total)}</span></div>
      <p class="fine" style="margin:.75rem 0 0">The piece is made and held at the shop, insured, and leaves with the final instalment. Cancel at any point and the metal comes back at the day's rate less 3% refining.</p>`;
    }
    ["layTotal", "layMonths", "layAdvance"].forEach((id) => $("#" + id).addEventListener("input", lay));
    lay();
  }

  /* ---------------------------------------------------------- size guide */
  function initSizeGuide() {
    const rt = $("#ringTable");
    if (!rt) return;
    rt.innerHTML = `<thead><tr><th>Pakistan / India</th><th>Circumference</th><th>UK</th><th>US</th></tr></thead><tbody>` +
      C.ringSizes.map((s) => `<tr><td>${s.pk}</td><td>${s.mm} mm</td><td>${s.uk}</td><td>${s.us}</td></tr>`).join("") + "</tbody>";
    $("#bangleTable").innerHTML = `<thead><tr><th>Size</th><th>Inner diameter</th><th>Inner circumference</th><th></th></tr></thead><tbody>` +
      C.bangleSizes.map((b) => `<tr><td>${b.id}</td><td>${b.inches}</td><td>${(b.mm * Math.PI / 10).toFixed(1)} cm</td><td class="fine">${b.note}</td></tr>`).join("") + "</tbody>";
    $("#chainTable").innerHTML = `<thead><tr><th>Length</th><th>Where it sits</th></tr></thead><tbody>` +
      C.chainLengths.map((c) => `<tr><td>${c.label}</td><td class="fine">${c.note}</td></tr>`).join("") + "</tbody>";

    function conv() {
      const std = $("#convStandard").value;
      const v = $("#convValue").value.trim().toUpperCase();
      if (!v) return ($("#convOut").innerHTML = "");
      const hit = C.ringSizes.find((s) => (std === "PK" ? String(s.pk) === v : std === "UK" ? s.uk === v : String(s.us) === v));
      $("#convOut").innerHTML = hit
        ? `<dl><dt>Pakistan / India</dt><dd>${hit.pk}</dd><dt>UK</dt><dd>${hit.uk}</dd><dt>US</dt><dd>${hit.us}</dd><dt>Circumference</dt><dd>${hit.mm} mm</dd></dl>`
        : `<p class="fine" style="margin:0">No match for “${esc(v)}” on the ${std} scale. Half sizes fall between two rows — take the larger.</p>`;
    }
    $("#convStandard").addEventListener("change", conv);
    $("#convValue").addEventListener("input", conv);

    $("#bangleGirth").addEventListener("input", (e) => {
      const cm = Number(e.target.value);
      if (!cm) return ($("#bangleOut").innerHTML = "");
      const inches = cm / Math.PI / 2.54;
      const best = C.bangleSizes.reduce((a, b) => Math.abs(Number(b.id) - inches) < Math.abs(Number(a.id) - inches) ? b : a);
      $("#bangleOut").innerHTML = `<dl><dt>Your measurement</dt><dd>${cm} cm around the fist</dd>
        <dt>Inner diameter needed</dt><dd>${inches.toFixed(2)} in</dd></dl>
        <div class="grand"><span>Closest size</span><span>${best.inches}</span></div>
        <p class="fine" style="margin:.75rem 0 0">If you are between two, take the larger for a hollow bangle and the smaller for a solid one.</p>`;
    });
  }

  /* ----------------------------------------------------------------- FAQ */
  function initFAQ() {
    const box = $("#faqList");
    if (!box) return;
    box.innerHTML = C.faqs.map((f) =>
      `<details><summary>${esc(f.q)}</summary><div class="acc__body">${esc(f.a)}</div></details>`).join("");
  }

  /* --------------------------------------------------------- appointment */
  function initAppointment() {
    const form = $("#apptForm");
    if (!form) return;
    let kind = "bridal";
    const today = new Date();
    $("#apptDate").min = today.toISOString().slice(0, 10);
    $("#apptDate").value = new Date(today.getTime() + 2 * 864e5).toISOString().slice(0, 10);
    $("#apptKind").addEventListener("click", (e) => {
      const b = e.target.closest("[data-kind]");
      if (!b) return;
      kind = b.dataset.kind;
      $$("#apptKind .pill").forEach((x) => x.setAttribute("aria-pressed", x === b));
    });
    $("#apptSubmit").addEventListener("click", async (e) => {
      e.preventDefault();
      const payload = {
        kind, name: $("#apptName").value.trim(), phone: $("#apptPhone").value.trim(),
        date: $("#apptDate").value, time: $("#apptTime").value,
        guests: $("#apptGuests").value, notes: $("#apptNotes").value.trim(),
      };
      if (payload.name.length < 3) return toast("We need a name for the book");
      if (!/^(?:\+92|0092|0)?3\d{9}$/.test(payload.phone.replace(/[\s-]/g, ""))) return toast("A Pakistani mobile number, like 0300 1234567");
      try {
        const r = await api("/api/appointments", { method: "POST", body: JSON.stringify(payload) });
        $("#apptResult").innerHTML = `<div class="callout"><h3 class="h4">Requested</h3><p>Reference ${esc(r.reference)}. We confirm on WhatsApp within a couple of hours during shop time.</p></div>`;
      } catch (err) {
        const text = `Appointment request — ${kind}\nName: ${payload.name}\nPhone: ${payload.phone}\n${payload.date} at ${payload.time}\nGuests: ${payload.guests}\n${payload.notes}`;
        $("#apptResult").innerHTML = `<div class="callout"><h3 class="h4">Send it on WhatsApp</h3>
          <p>The booking server is not connected on this deployment, so send the request straight to the desk.</p>
          <a class="btn btn--sm" href="${waLink(text)}" target="_blank" rel="noopener">Send the request</a></div>`;
      }
    });
  }

  /* --------------------------------------------------------------- track */
  function initTrack() {
    const btn = $("#trackBtn");
    if (!btn) return;
    const preset = param("order");
    if (preset) $("#trackInput").value = preset;
    async function look() {
      const num = $("#trackInput").value.trim().toUpperCase();
      if (!num) return;
      const out = $("#trackResult");
      out.innerHTML = '<p class="fine">Looking…</p>';
      try {
        const o = await api("/api/orders/" + encodeURIComponent(num));
        const steps = ["new", "confirmed", "packed", "dispatched", "delivered"];
        const at = steps.indexOf(o.status);
        out.innerHTML = `<div class="callout">
          <h3 class="h4">${esc(o.orderNumber)}</h3>
          <ol class="steps" style="margin:1rem 0">${steps.map((s, i) =>
            `<li style="opacity:${i <= at ? 1 : 0.4}"><h3 class="h4">${titleCase(s)}</h3><p>${i === at ? "Where it is now" : i < at ? "Done" : "To come"}</p></li>`).join("")}</ol>
          <p class="fine">${esc(o.courier || "Courier")}${o.trackingNumber ? " · CN " + esc(o.trackingNumber) : ""} · ${money(o.total)} ${o.paymentStatus === "pending_cod" ? "payable to the rider" : "paid"}</p>
        </div>`;
      } catch (e) {
        out.innerHTML = `<div class="callout"><h3 class="h4">We could not find that</h3>
          <p>${CFG.API ? "Check the number, or message the desk with the mobile you ordered on." : "This deployment is running without the order server. Message the desk and we will look it up."}</p>
          <a class="link-quiet" href="${waLink("Where is my order? Number: " + num)}">Ask on WhatsApp</a></div>`;
      }
    }
    btn.addEventListener("click", look);
    $("#trackInput").addEventListener("keydown", (e) => { if (e.key === "Enter") look(); });
    if (preset) look();
    const acct = $("#acctTrack");
    if (acct) acct.addEventListener("click", () => { location.href = "track.html?order=" + encodeURIComponent($("#acctOrder").value.trim()); });
  }

  /* ------------------------------------------------------ wishlist page */
  function initWishlistPage() {
    const grid = $("#wishGrid");
    if (!grid) return;
    function run() {
      const list = Wish.list.map(bySlug).filter(Boolean);
      if (!list.length) {
        grid.innerHTML = `<div class="callout" style="grid-column:1/-1"><h3 class="h4">Nothing saved yet</h3>
          <p>Tap the heart on any piece and it waits here.</p><a class="link-quiet" href="shop.html">Start looking</a></div>`;
        return;
      }
      paint("#wishGrid", list);
    }
    $("#wishClear").addEventListener("click", () => { Wish.list = []; store.set("wish", []); Wish.paint(); run(); });
    $("#wishShare").addEventListener("click", () => {
      const list = Wish.list.map(bySlug).filter(Boolean);
      if (!list.length) return toast("Save something first");
      location.href = waLink("Pieces I have saved at Sitara:\n" + list.map((p) => `• ${p.name} — ${money(p.price)}`).join("\n"));
    });
    $("#wishCopy").addEventListener("click", () => {
      const url = location.origin + location.pathname.replace(/[^/]*$/, "") + "wishlist.html?list=" + Wish.list.join(",");
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      toast("Link copied");
    });
    const shared = param("list");
    if (shared) { Wish.list = shared.split(",").filter(Boolean); store.set("wish", Wish.list); Wish.paint(); }
    run();
    document.addEventListener("click", (e) => { if (e.target.closest("[data-wish]")) setTimeout(run, 60); });
  }

  /* ------------------------------------------------------- compare page */
  async function initComparePage() {
    const table = $("#compareTable");
    if (!table) return;
    const list = Compare.list.map(bySlug).filter(Boolean);
    if (!list.length) {
      table.outerHTML = `<div class="callout"><h3 class="h4">Nothing to compare yet</h3>
        <p>Use the ⇄ button on any product card to add up to four pieces.</p><a class="link-quiet" href="shop.html">Browse the shop</a></div>`;
      return;
    }
    const r = await goldRate();
    const rows = [
      ["", (p) => `<img src="${p.thumbs[0]}" alt="" style="width:110px;aspect-ratio:3/4;object-fit:cover">`],
      ["Piece", (p) => `<a class="link-quiet" href="product.html?slug=${p.slug}">${esc(p.name)}</a>`],
      ["Price", (p) => money(p.price)],
      ["Metal", (p) => titleCase(p.metal) + (p.karat ? " · " + p.karat : "")],
      ["Weight", (p) => p.weightG + " g"],
      ["Gold value today", (p) => (metalValue(p, r) ? money(metalValue(p, r)) : "—")],
      ["Making", (p) => money(p.makingPkr)],
      ["Stone", (p) => titleCase(p.gemstone || "none")],
      ["Occasion", (p) => p.occasion.map(titleCase).join(", ")],
      ["Stock", (p) => (p.stock ? p.stock + " ready" : "Made to order")],
      ["", (p) => `<button class="btn btn--sm" data-quick="${p.id}">Add to bag</button>`],
    ];
    table.innerHTML = rows.map((row) =>
      `<tr><th>${row[0]}</th>${list.map((p) => `<td>${row[1](p)}</td>`).join("")}</tr>`).join("");
  }

  /* ------------------------------------------------------------ checkout */
  async function initCheckout() {
    if (PAGE !== "checkout") return;
    const items = Cart.items;
    $("#cityList").innerHTML = C.cities.map((c) => `<option value="${c.name}">`).join("");
    $("#coCity").value = store.get("city", "");
    $("#coCourier").innerHTML = ["Leopards Courier — 1-2 days", "TCS — 1-2 days", "Call Courier — 2-4 days"]
      .map((c) => `<option>${c}</option>`).join("");

    const coins = store.get("coins", 0);
    if (coins >= 100) {
      $("#coCoinsWrap").hidden = false;
      $("#coCoinsCount").textContent = coins;
    }

    const methods = [
      { id: "cod", name: "Cash on delivery", note: `Pay the rider. Available up to ${money(CFG.COD_MAX)}.`, on: true },
      { id: "jazzcash", name: "JazzCash", note: "Mobile account or voucher", on: true },
      { id: "easypaisa", name: "Easypaisa", note: "Mobile account", on: true },
      { id: "raast", name: "Bank transfer / Raast", note: "We send the IBAN and confirm on receipt", on: true },
      { id: "card", name: "Debit or credit card", note: "3D Secure, processed by PayPro — we never see the number", on: true },
    ];
    let method = "cod";
    let coupon = null;

    function paintPay() {
      $("#payOptions").innerHTML = methods.map((m) => {
        const off = m.id === "cod" && totals().total > CFG.COD_MAX;
        return `<label class="pay-option${off ? " is-off" : ""}" data-active="${method === m.id && !off}" data-method="${m.id}">
          <input type="radio" name="pay" value="${m.id}" ${method === m.id ? "checked" : ""} ${off ? "disabled" : ""}>
          <span><strong style="font-weight:400">${m.name}</strong>
          <small>${off ? "Not available above " + money(CFG.COD_MAX) + " — please pay online" : m.note}</small></span></label>`;
      }).join("");
    }

    function totals() {
      const sub = items.reduce((a, i) => a + i.price * i.qty, 0);
      const stack = items.filter((i) => i.bundle === "stack").reduce((a, i) => {
        const p = byId(i.id);
        return a + (p ? (p.price - i.price) * i.qty : 0);
      }, 0);
      let discount = 0;
      if (coupon) discount = coupon.kind === "percent" ? Math.round((sub * coupon.value) / 100) : Math.min(sub, coupon.value);
      const useCoins = $("#coCoins") && $("#coCoins").checked ? Math.min(coins, Math.round((sub - discount) * 0.2)) : 0;
      const gift = $("#coGift").checked ? CFG.GIFT_WRAP : 0;
      const goods = sub - discount - useCoins;
      const city = $("#coCity").value.trim();
      const zone = (C.cities.find((c) => c.name.toLowerCase() === city.toLowerCase()) || { zone: 3 }).zone;
      const ship = goods >= CFG.FREE_SHIPPING || goods === 0 ? 0 : 250 + (zone - 1) * 90;
      const total = goods + gift + ship;
      return { sub, stack, discount, useCoins, gift, ship, total, zone, gst: Math.round(total - total / (1 + CFG.GST)) };
    }

    function paintSummary() {
      const t = totals();
      $("#coItems").innerHTML = items.length
        ? items.map((i) => `<div class="co-line"><span>${esc(i.name)}${i.size ? " · " + esc(i.size) : ""} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")
        : `<p class="fine">Your bag is empty. <a class="link-quiet" href="shop.html">Shop the collection</a>.</p>`;
      $("#coSub").textContent = money(t.sub + t.stack);
      $("#coStackRow").hidden = !t.stack;
      $("#coStack").textContent = "− " + money(t.stack);
      $("#coDiscRow").hidden = !(t.discount || t.useCoins);
      $("#coDisc").textContent = "− " + money(t.discount + t.useCoins);
      $("#coGiftRow").hidden = !t.gift;
      $("#coShip").textContent = t.ship ? money(t.ship) : items.length ? "Complimentary" : "—";
      $("#coGst").textContent = money(t.gst);
      $("#coTotal").textContent = money(t.total);
      $("#coEta").textContent = $("#coCity").value
        ? `Delivered in ${t.zone === 1 ? "1–2" : t.zone === 2 ? "2–3" : "3–5"} working days`
        : "Enter your city for a delivery estimate";
      paintPay();
    }

    ["coCity", "coGift", "coCoins"].forEach((id) => {
      const el = $("#" + id);
      if (el) el.addEventListener("change", () => {
        if (id === "coGift") $("#coGiftNoteWrap").hidden = !$("#coGift").checked;
        if (id === "coCity") store.set("city", $("#coCity").value.trim());
        paintSummary();
      });
    });
    $("#coApply").addEventListener("click", () => {
      const code = $("#coCoupon").value.trim().toUpperCase();
      const known = { SALAM10: { kind: "percent", value: 10 }, SPIN10: { kind: "percent", value: 10 }, SPIN30: { kind: "percent", value: 5 }, SPIN50: { kind: "percent", value: 15 } };
      if (known[code]) {
        coupon = Object.assign({ code }, known[code]);
        $("#coCouponMsg").textContent = `${code} applied — the server re-checks it when you order.`;
      } else {
        coupon = null;
        $("#coCouponMsg").textContent = "That code is not recognised.";
      }
      paintSummary();
    });
    $("#payOptions").addEventListener("click", (e) => {
      const l = e.target.closest("[data-method]");
      if (!l || l.classList.contains("is-off")) return;
      method = l.dataset.method;
      paintPay();
    });

    $("#placeOrder").addEventListener("click", async () => {
      if (!items.length) return toast("Your bag is empty");
      const customer = {
        name: $("#coName").value.trim(), phone: $("#coPhone").value.trim(), email: $("#coEmail").value.trim(),
        address: $("#coAddr").value.trim(), city: $("#coCity").value.trim(),
      };
      if (customer.name.length < 3) return toast("We need the name the parcel should go to");
      if (!/^(?:\+92|0092|0)?3\d{9}$/.test(customer.phone.replace(/[\s-]/g, ""))) return toast("A Pakistani mobile, like 0300 1234567");
      if (customer.address.length < 10) return toast("A full address the rider can find");
      if (!customer.city) return toast("Which city?");

      const payload = {
        customer, items: items.map((i) => ({ id: i.id, qty: i.qty, size: i.size, bundle: i.bundle })),
        paymentMethod: method, coupon: coupon && coupon.code, courier: $("#coCourier").value,
        giftWrap: $("#coGift").checked, giftNote: $("#coGiftNote").value.trim(),
        redeemCoins: $("#coCoins") && $("#coCoins").checked ? coins : 0,
        ref: store.get("referredBy", ""),
      };
      $("#placeOrder").disabled = true;
      try {
        const r = await api("/api/orders", { method: "POST", body: JSON.stringify(payload) });
        if (r.redirectUrl) return (location.href = r.redirectUrl);
        if (r.formPost) return postForm(r.formPost);
        Cart.clear();
        store.set("coins", Math.max(0, coins - (payload.redeemCoins || 0)) + Math.floor(r.total / 100));
        location.href = "track.html?order=" + encodeURIComponent(r.orderNumber);
      } catch (e) {
        $("#placeOrder").disabled = false;
        const t = totals();
        const text = `Order from the website\n${items.map((i) => `${i.qty} × ${i.name}${i.size ? " (" + i.size + ")" : ""}`).join("\n")}\nTotal: ${money(t.total)}\n\n${customer.name}\n${customer.phone}\n${customer.address}, ${customer.city}\nPayment: ${method}`;
        $("#coResult").innerHTML = `<div class="callout"><h3 class="h4">${CFG.API ? "That did not go through" : "Order server not connected"}</h3>
          <p>${CFG.API ? esc(e.message) : "This deployment is running the storefront only. Send the order to the desk and someone will confirm it within the hour."}</p>
          <a class="btn btn--sm" href="${waLink(text)}" target="_blank" rel="noopener">Send this order on WhatsApp</a></div>`;
      }
    });

    function postForm(fp) {
      const f = document.createElement("form");
      f.method = "POST";
      f.action = fp.endpoint;
      Object.keys(fp.fields).forEach((k) => {
        const i = document.createElement("input");
        i.type = "hidden"; i.name = k; i.value = fp.fields[k];
        f.appendChild(i);
      });
      document.body.appendChild(f);
      f.submit();
    }

    paintSummary();
  }

  /* ------------------------------------------------------------- account */
  function initAccount() {
    if (PAGE !== "account") return;
    const coins = store.get("coins", 250);
    store.set("coins", coins);
    $("#coinBalance").textContent = coins;
    const spent = store.get("spent", 0);
    const tier = C.tiers.slice().reverse().find((t) => spent >= t.min) || C.tiers[0];
    const next = C.tiers[C.tiers.indexOf(tier) + 1];
    $("#tierBar").innerHTML = `<div class="label" style="margin-top:.75rem">${tier.name} tier</div>
      <div class="tier-bar"><span style="width:${next ? Math.min(100, (spent / next.min) * 100) : 100}%"></span></div>
      <div class="fine" style="color:var(--gold-soft)">${next ? `${money(next.min - spent)} more to ${next.name}` : "The top tier — thank you"}</div>`;
    $("#tierGrid").innerHTML = C.tiers.map((t) => `<div class="tier" data-current="${t.id === tier.id}">
      <h3>${t.name}</h3><div class="fine">${t.min ? "from " + money(t.min) + " spent" : "from your first order"}</div>
      <ul>${t.perks.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("");
    Wish.paint();

    let code = store.get("refCode", null);
    if (!code) { code = "SR" + Math.random().toString(36).slice(2, 7).toUpperCase(); store.set("refCode", code); }
    const link = location.origin + location.pathname.replace(/[^/]*$/, "") + "index.html?ref=" + code;
    $("#refLink").value = link;
    $("#refCopy").addEventListener("click", () => {
      if (navigator.clipboard) navigator.clipboard.writeText(link);
      else $("#refLink").select();
      toast("Link copied — send it on WhatsApp");
    });
    $("#refWa").href = waLink("I shop at Sitara — use my link and we both get PKR 500 credit: " + link);
  }

  /* ---------------------------------------------------------------- chat */
  function initChat() {
    const fab = $("#chatFab");
    if (!fab) return;
    const panel = $("#chatPanel");
    const log = $("#chatLog");
    const chips = $("#chatChips");
    const say = (who, text) => {
      const d = document.createElement("div");
      d.className = "bubble " + who;
      d.innerHTML = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    };
    const prompts = ["Is this anti-tarnish?", "Do you do cash on delivery?", "Bridal under 5 lakh", "How long is delivery?"];
    chips.innerHTML = prompts.map((p) => `<button data-ask="${esc(p)}">${esc(p)}</button>`).join("");

    fab.addEventListener("click", () => {
      panel.classList.toggle("is-open");
      if (panel.classList.contains("is-open") && !log.children.length)
        say("bot", "Assalam o alaikum. Ask about a piece, gold purity, delivery or returns — or say “bridal under 5 lakh”.");
    });
    chips.addEventListener("click", (e) => {
      const b = e.target.closest("[data-ask]");
      if (!b) return;
      $("#chatInput").value = b.dataset.ask;
      $("#chatForm").dispatchEvent(new Event("submit", { cancelable: true }));
    });

    $("#chatForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = $("#chatInput");
      const q = input.value.trim();
      if (!q) return;
      say("me", esc(q));
      input.value = "";
      if (CFG.API) {
        try { const d = await api("/api/chat", { method: "POST", body: JSON.stringify({ message: q }) }); return say("bot", esc(d.reply)); }
        catch (err) {}
      }
      say("bot", answer(q));
    });

    function answer(q) {
      const s = expand(q);
      if (/tarnish|kala|black|fade|colour|color/.test(s))
        return "Anything marked anti-tarnish is sealed and safe for daily wear including wudu. Plain sterling darkens over time — that is the work, and a silver cloth brings the high points back.";
      if (/cod|cash on delivery|payment|jazz ?cash|easypaisa|card|raast/.test(s))
        return `Cash on delivery anywhere in Pakistan up to ${money(CFG.COD_MAX)}, plus JazzCash, Easypaisa, Raast and cards. Bridal above two lakh takes a 30% advance.`;
      if (/deliver|shipping|courier|how long|kitne din/.test(s))
        return `Leopards or TCS, dispatched within 24 hours. One to two days for the big cities, three to five for the north. Complimentary over ${money(CFG.FREE_SHIPPING)}.`;
      if (/return|exchange|refund/.test(s))
        return "Seven days from delivery, unworn and in the box, for a full refund. Engraved and made-to-order bridal can be exchanged but not returned.";
      if (/hallmark|purity|916|22k|gold rate|tola|making/.test(s))
        return "Gold is assayed and stamped — 916 for 22k, 875 for 21k, 750 for 18k. The day's rate is on the ticker, and every product page shows the metal value and the making charge separately.";
      if (/size|resize|ring size|bangle/.test(s))
        return "Sizes run on the Pakistani scale. There is a converter and a bangle measurement on the size guide page, and resizing gold is free for life.";
      if (/appointment|visit|shop|address|atelier/.test(s))
        return "Shop 14, Liberty Market, Gulberg III, Lahore, open daily 12pm to 9pm. Book a sitting on the appointment page and we will have the trays ready.";

      const budget = /(\d+(?:\.\d+)?)\s*(lakh|lac)/.exec(s);
      let list = searchProducts(q);
      if (budget) {
        const cap = Number(budget[1]) * 100000;
        list = (list.length ? list : C.products).filter((p) => p.price <= cap);
        if (/bridal|dulhan/.test(s)) list = list.filter((p) => p.occasion.includes("bridal"));
      }
      if (list.length)
        return "These fit: " + list.slice(0, 3).map((p) => `<a class="link-quiet" href="product.html?slug=${p.slug}">${esc(p.name)}</a> (${money(p.price)})`).join(", ") + ".";
      return `I am not sure about that one. <a class="link-quiet" href="${waLink(q)}" target="_blank">Ask the desk on WhatsApp</a> — someone replies within the hour.`;
    }
  }

  /* -------------------------------------------------------------- popups */
  function initPopups() {
    const exit = $("#exitModal");
    const seen = store.get("popupSeen", 0);
    if (exit && Date.now() - seen > 7 * 864e5 && !store.get("subscriber", null)) {
      let fired = false;
      const fire = () => {
        if (fired || document.querySelector(".modal.is-open, .drawer.is-open") || PAGE === "checkout") return;
        fired = true;
        store.set("popupSeen", Date.now());
        openModal("#exitModal");
      };
      document.addEventListener("mouseout", (e) => { if (e.clientY <= 0 && !e.relatedTarget) fire(); });
      setTimeout(() => { if (window.innerWidth < 900) fire(); }, 50000);
    }
    const ef = $("#exitForm");
    if (ef) ef.addEventListener("submit", (e) => {
      e.preventDefault();
      subscribe($("#exitEmail").value, "exit-intent");
      exit.innerHTML = '<div class="center" style="padding:1rem"><h2>Code SALAM10</h2><p>Ten percent off your first order. It is in your inbox too.</p><button class="btn" onclick="sitaraClose()">Start shopping</button></div>';
    });

    const wheelModal = $("#wheelModal");
    if (wheelModal) {
      $$("[data-open-wheel]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openModal("#wheelModal"); }));
      const wheel = $("#wheel");
      const prizes = ["10% off", "Complimentary delivery", "5% off", "200 Sitara coins", "15% off over 25k", "Free engraving"];
      const codes = ["SPIN10", "SHIPFREE", "SPIN30", "COINS200", "SPIN50", "ENGRAVE"];
      $("#spinBtn").addEventListener("click", () => {
        if (store.get("spun", false)) return toast("One spin per customer — that is the point of it");
        store.set("spun", true);
        const idx = Math.floor(Math.random() * prizes.length);
        const deg = 360 * 5 + (360 - idx * (360 / prizes.length)) - 30;
        wheel.style.transition = "transform 4.2s cubic-bezier(.16,.84,.24,1)";
        wheel.style.transform = "rotate(" + deg + "deg)";
        setTimeout(() => {
          $("#spinResult").innerHTML = `You won <b>${prizes[idx]}</b> — code <b>${codes[idx]}</b>. Use it at checkout.`;
          store.set("coupon", codes[idx]);
          if (codes[idx] === "COINS200") store.set("coins", store.get("coins", 250) + 200);
        }, 4300);
      });
    }
  }

  function subscribe(email, source) {
    if (!email) return;
    store.set("subscriber", email);
    if (CFG.API) api("/api/subscribe", { method: "POST", body: JSON.stringify({ email, source }) }).catch(() => {});
  }

  /* -------------------------------------------------------- quick view */
  function initQuickView() {
    document.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-quick-view]");
      if (!b) return;
      e.preventDefault();
      const p = bySlug(b.dataset.quickView);
      if (!p) return;
      const r = await goldRate();
      const metal = metalValue(p, r);
      $("#quickBody").innerHTML = `
        <div class="pdp" style="gap:2rem">
          <div><img src="${p.images[0]}" alt="${esc(p.name)}" style="width:100%;aspect-ratio:3/4;object-fit:cover"></div>
          <div>
            <div class="label" style="color:var(--gold)">${esc(titleCase(p.collection))}</div>
            <h2 style="margin-top:.3rem">${esc(p.name)}</h2>
            <div class="pdp__price">${money(p.price)}</div>
            <div class="pdp__tax">${p.weightG} g · ${p.karat || titleCase(p.metal)} · GST included</div>
            <p style="margin-top:1rem;color:var(--stone)">${esc(p.description.slice(0, 220))}…</p>
            ${metal ? `<p class="fine">Gold alone, at today's rate: ${money(metal)} · making ${money(p.makingPkr)}</p>` : ""}
            <div class="row" style="margin-top:1rem">
              ${p.stock ? `<button class="btn" data-quick="${p.id}">Add to bag</button>` : ""}
              <a class="btn btn--ghost" href="product.html?slug=${p.slug}">Full details</a>
            </div>
          </div>
        </div>`;
      openModal("#quickModal");
    });
  }

  /* ----------------------------------------------------- reveals & misc */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) return $$(".reveal").forEach((e) => e.classList.add("is-in"));
    if (!io) io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -6% 0px" });
    $$(".reveal:not(.is-in)").forEach((e) => io.observe(e));
  }

  function initParallax() {
    const layers = $$("[data-parallax]");
    if (!layers.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        layers.forEach((l) => { l.style.transform = "translate3d(0," + y * Number(l.dataset.parallax) + "px,0)"; });
        ticking = false;
      });
    }, { passive: true });
  }

  function initSizeModal() {
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-open-size]");
      if (!b) return;
      e.preventDefault();
      const type = b.dataset.openSize;
      $("#sizeModalBody").innerHTML = type === "bangle"
        ? `<p class="fine">Bangles are sold by inner diameter in inches. Press your thumb into your palm, measure around the widest part of that fist, and divide by 3.14.</p>
           <div class="table-scroll"><table><thead><tr><th>Size</th><th>Inner diameter</th><th>Fist measurement</th><th></th></tr></thead><tbody>
           ${C.bangleSizes.map((s) => `<tr><td>${s.id}</td><td>${s.inches}</td><td>${(s.mm * Math.PI / 10).toFixed(1)} cm</td><td class="fine">${s.note}</td></tr>`).join("")}
           </tbody></table></div>`
        : `<p class="fine">Measure at the end of the day when the hand is largest. Between sizes, take the larger — resizing down is easier than up.</p>
           <div class="table-scroll"><table><thead><tr><th>Pakistan / India</th><th>Circumference</th><th>UK</th><th>US</th></tr></thead><tbody>
           ${C.ringSizes.map((s) => `<tr><td>${s.pk}</td><td>${s.mm} mm</td><td>${s.uk}</td><td>${s.us}</td></tr>`).join("")}
           </tbody></table></div>`;
      $("#sizeModalBody").insertAdjacentHTML("beforeend", '<p style="margin-top:1rem"><a class="link-quiet" href="size-guide.html">The full size guide</a></p>');
      openModal("#sizeModal");
    });
  }

  function initContact() {
    const send = $("#cSend");
    if (!send) return;
    send.addEventListener("click", () => {
      const t = `${$("#cName").value.trim()} (${$("#cPhone").value.trim()}):\n${$("#cMsg").value.trim()}`;
      location.href = waLink(t);
    });
  }

  function registerSW() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  /* ------------------------------------------------------------ bootstrap */
  function init() {
    initLang();
    Cart.paint();
    Wish.paint();
    paintTicker();
    initSearch();
    initHome();
    initPLP();
    initPDP();
    initCollections();
    initBridal();
    initGifts();
    initJournal();
    initArticle();
    initFinder();
    initTryOnModal();
    initTryOnPage();
    initStack();
    initGold();
    initSizeGuide();
    initFAQ();
    initAppointment();
    initTrack();
    initWishlistPage();
    initComparePage();
    initCheckout();
    initAccount();
    initChat();
    initPopups();
    initQuickView();
    initSizeModal();
    initContact();
    initParallax();
    observeReveals();
    registerSW();

    const ref = param("ref");
    if (ref) store.set("referredBy", ref);
    const ordered = param("ordered");
    if (ordered) toast("Order " + ordered + " confirmed — we will WhatsApp you");

    $$("[data-open-cart]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openDrawer(); }));
    $("#scrim") && $("#scrim").addEventListener("click", closeAll);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
    document.addEventListener("click", (e) => {
      if (e.target.closest(".modal__close, [data-close]")) { e.preventDefault(); closeAll(); }
      const q = e.target.closest("[data-quick]");
      if (q) { e.preventDefault(); Cart.add(q.dataset.quick, {}); }
      const rm = e.target.closest("[data-rm]");
      if (rm) Cart.remove(rm.dataset.rm);
      const qt = e.target.closest("[data-qty]");
      if (qt) Cart.qty(qt.dataset.qty, Number(qt.dataset.d));
      const w = e.target.closest("[data-wish]");
      if (w) { e.preventDefault(); Wish.toggle(w.dataset.wish); }
      const cmp = e.target.closest("[data-compare]");
      if (cmp) { e.preventDefault(); Compare.toggle(cmp.dataset.compare); }
      const nt = e.target.closest("[data-notify]");
      if (nt) {
        const p = byId(nt.dataset.notify);
        const email = prompt("Where should we write when the " + p.name + " is back?");
        if (email) {
          if (CFG.API) api("/api/notify/back-in-stock", { method: "POST", body: JSON.stringify({ productId: p.id, email }) }).catch(() => {});
          toast("We will write the moment it lands");
        }
      }
    });
    const burger = $("#burger");
    if (burger) burger.addEventListener("click", () => {
      const nav = $("#mobileNav");
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open);
    });
    $$("[data-wa]").forEach((a) => (a.href = waLink(a.dataset.wa)));
    const nl = $("#newsletterForm");
    if (nl) nl.addEventListener("submit", (e) => {
      e.preventDefault();
      subscribe($("#newsletterEmail").value, "footer");
      nl.innerHTML = "<p style='color:var(--gold-soft)'>You are on the list. Watch for the first drop.</p>";
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
