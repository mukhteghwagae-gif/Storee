/* ==========================================================================
   SITARA — analytics & pixels
   Every provider loads ONLY if its id is configured on window.SITARA_ANALYTICS
   (set by the build from .env, or injected by your host). Nothing loads, and
   no third-party script touches the page, unless you opt in — which is both a
   performance choice and a privacy one. A single consent gate governs them all.
   ========================================================================== */
(function () {
  "use strict";
  var CFG = window.SITARA_ANALYTICS || {};   // { ga4, mixpanel, hotjar, fbPixel, tiktok, gtm }
  var CONSENT_KEY = "sitara:consent";

  function consented() { try { return localStorage.getItem(CONSENT_KEY) === "yes"; } catch (e) { return false; } }
  function anyConfigured() { return Object.keys(CFG).some(function (k) { return CFG[k]; }); }

  /* ---- unified event bus: your app calls track(), we fan out to each pixel ---- */
  var queue = [];
  function track(name, params) {
    params = params || {};
    if (!consented()) { queue.push([name, params]); return; }
    // Google Analytics 4 / GTM
    if (window.gtag) window.gtag("event", name, params);
    if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params));
    // Mixpanel
    if (window.mixpanel && window.mixpanel.track) window.mixpanel.track(name, params);
    // Facebook Pixel — map common commerce events to standard names
    if (window.fbq) {
      var fbMap = { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", purchase: "Purchase", search: "Search" };
      window.fbq("track", fbMap[name] || "CustomEvent", params);
    }
    // TikTok Pixel
    if (window.ttq) {
      var ttMap = { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", purchase: "CompletePayment" };
      if (ttMap[name]) window.ttq.track(ttMap[name], params);
    }
  }
  window.sitaraTrack = track;

  function flush() { queue.splice(0).forEach(function (e) { track(e[0], e[1]); }); }

  /* ---- loaders (each a no-op without its id) ---- */
  function loadScript(src, attrs) {
    var s = document.createElement("script");
    s.async = true; s.src = src;
    if (attrs) Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
    return s;
  }
  function boot() {
    if (CFG.ga4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", CFG.ga4, { anonymize_ip: true });
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CFG.ga4));
    }
    if (CFG.gtm) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      loadScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(CFG.gtm));
    }
    if (CFG.mixpanel) {
      // minimal Mixpanel stub → real lib
      loadScript("https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js").onload = function () {
        if (window.mixpanel && window.mixpanel.init) window.mixpanel.init(CFG.mixpanel, { track_pageview: true, persistence: "localStorage" });
      };
    }
    if (CFG.hotjar) {
      window.hj = window.hj || function () { (window.hj.q = window.hj.q || []).push(arguments); };
      window._hjSettings = { hjid: CFG.hotjar, hjsv: 6 };
      loadScript("https://static.hotjar.com/c/hotjar-" + CFG.hotjar + ".js?sv=6");
    }
    if (CFG.fbPixel) {
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", CFG.fbPixel); window.fbq("track", "PageView");
    }
    if (CFG.tiktok) {
      !function (w, d, t) {
        w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
        ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
        ttq.setAndDefer = function (o, m) { o[m] = function () { o.push([m].concat(Array.prototype.slice.call(arguments, 0))); }; };
        for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.load = function (e) { var s = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = s; ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); var o = d.createElement("script"); o.async = !0; o.src = s + "?sdkid=" + e; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a); };
        ttq.load(CFG.tiktok); ttq.page();
      }(window, document, "ttq");
    }
    flush();
  }

  /* ---- consent banner (only shown if something is configured & undecided) ---- */
  function consentBanner() {
    if (!anyConfigured()) return;                 // nothing to consent to
    if (localStorage.getItem(CONSENT_KEY)) { if (consented()) boot(); return; }
    var bar = document.createElement("div");
    bar.className = "consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookie consent");
    bar.innerHTML =
      '<p>We use privacy-respecting analytics to make the shop better. No data is sold, ever. ' +
      '<a href="privacy.html" class="link-quiet">How we use it</a></p>' +
      '<div class="consent__btns"><button class="btn btn--sm" data-consent="yes">Allow</button>' +
      '<button class="btn btn--ghost btn--sm" data-consent="no">Only what is necessary</button></div>';
    document.body.appendChild(bar);
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (!b) return;
      var ok = b.getAttribute("data-consent") === "yes";
      try { localStorage.setItem(CONSENT_KEY, ok ? "yes" : "no"); } catch (err) {}
      bar.remove();
      if (ok) boot();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", consentBanner);
  else consentBanner();
})();
