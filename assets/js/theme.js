/* ==========================================================================
   SITARA — theme, dark mode, seasonal skins, accessibility & analytics
   Runs before app.js paints so there is no flash of the wrong theme.
   ========================================================================== */
(function () {
  "use strict";
  var html = document.documentElement;
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("sitara:" + k); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("sitara:" + k, v); } catch (e) {} },
  };

  /* ---- apply saved prefs immediately (pre-paint, avoids FOUC) ---- */
  var mode = store.get("mode", "");                 // "", light, dark
  var contrast = store.get("contrast", "");         // "", high
  var cb = store.get("cb", "");                      // "", safe
  var fontscale = store.get("fontscale", "");        // "", large, xlarge
  var theme = store.get("theme", "auto");            // auto, none, eid, wedding, valentine, independence
  if (mode) html.setAttribute("data-mode", mode);
  if (contrast) html.setAttribute("data-contrast", contrast);
  if (cb) html.setAttribute("data-cb", cb);
  if (fontscale) html.setAttribute("data-fontscale", fontscale);

  /* ---- seasonal auto-detection (Pakistan calendar-aware, approximate) ----
     Auto picks a skin from the date; the user can always override or turn off.
     Islamic dates drift, so Eid windows are set generously and are meant to be
     confirmed by the shop each year in the admin announcement. */
  function seasonForToday() {
    var d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    if (m === 8 && day >= 10 && day <= 16) return "independence"; // 14 Aug
    if (m === 2 && day >= 7 && day <= 15) return "valentine";      // around 14 Feb
    // Wedding season in Pakistan clusters Oct–Feb
    if (m === 11 || m === 12 || m === 1) return "wedding";
    return "none";
  }
  function applyTheme(t) {
    if (t === "auto") t = seasonForToday();
    if (t && t !== "none") { html.setAttribute("data-theme", t); showRibbon(t); }
    else { html.removeAttribute("data-theme"); }
  }
  function showRibbon(t) {
    var labels = { eid: "Eid Mubarak — festive edit now on",
      wedding: "Wedding season — the trousseau atelier is open",
      valentine: "For someone you love — gift wrapping on us this week",
      independence: "Jashn-e-Azadi — green & gold, 14 August" };
    var r = document.querySelector(".season-ribbon");
    if (r && labels[t]) { r.textContent = labels[t]; r.classList.add("is-on"); }
  }
  applyTheme(theme);

  /* ---- OS colour-scheme change, when the user hasn't chosen ---- */
  if (window.matchMedia) {
    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (!store.get("mode", "")) { /* CSS media query handles it */ }
      });
    } catch (e) {}
  }

  /* ---- build the control dock ---- */
  function buildDock() {
    var toggle = document.createElement("button");
    toggle.className = "dock-toggle";
    toggle.setAttribute("aria-label", "Appearance and accessibility");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>';

    var dock = document.createElement("div");
    dock.className = "dock";
    dock.setAttribute("role", "dialog");
    dock.setAttribute("aria-label", "Appearance and accessibility settings");
    dock.innerHTML =
      '<section><h3>Appearance</h3><div class="dock__row" data-group="mode">' +
        btn("mode", "", "Auto") + btn("mode", "light", "Light") + btn("mode", "dark", "Dark") +
      '</div></section>' +
      '<section><h3>Season</h3><div class="dock__row" data-group="theme">' +
        btn("theme", "auto", "Auto") + btn("theme", "none", "None") + btn("theme", "eid", "Eid") +
        btn("theme", "wedding", "Wedding") + btn("theme", "valentine", "Love") + btn("theme", "independence", "14 Aug") +
      '</div></section>' +
      '<section><h3>Reading</h3><div class="dock__row" data-group="fontscale">' +
        btn("fontscale", "", "Normal") + btn("fontscale", "large", "Large") + btn("fontscale", "xlarge", "XL") +
      '</div></section>' +
      '<section><h3>Accessibility</h3><div class="dock__row" data-group="contrast">' +
        btn("contrast", "", "Standard") + btn("contrast", "high", "High contrast") +
      '</div><div class="dock__row" data-group="cb" style="margin-top:.4rem">' +
        btn("cb", "", "Default colours") + btn("cb", "safe", "Colour-blind safe") +
      '</div></section>';

    document.body.appendChild(toggle);
    document.body.appendChild(dock);

    toggle.addEventListener("click", function () {
      var open = dock.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      if (open) { var f = dock.querySelector(".dock__btn"); if (f) f.focus(); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") dock.classList.remove("is-open"); });
    document.addEventListener("click", function (e) {
      if (!dock.contains(e.target) && e.target !== toggle && dock.classList.contains("is-open")) dock.classList.remove("is-open");
    });

    dock.addEventListener("click", function (e) {
      var b = e.target.closest(".dock__btn");
      if (!b) return;
      var group = b.parentNode.getAttribute("data-group");
      var val = b.getAttribute("data-val");
      set(group, val);
      Array.prototype.forEach.call(b.parentNode.querySelectorAll(".dock__btn"), function (x) {
        x.setAttribute("aria-pressed", x === b);
      });
      if (window.sitaraBeacon) window.sitaraBeacon("search", { query: "theme:" + group + "=" + val });
    });
    reflect(dock);
  }

  function btn(group, val, label) {
    var current = currentValue(group);
    var pressed = current === val;
    return '<button class="dock__btn" data-val="' + val + '" aria-pressed="' + pressed + '">' + label + '</button>';
  }
  function currentValue(group) {
    if (group === "mode") return store.get("mode", "");
    if (group === "theme") return store.get("theme", "auto");
    if (group === "fontscale") return store.get("fontscale", "");
    if (group === "contrast") return store.get("contrast", "");
    if (group === "cb") return store.get("cb", "");
    return "";
  }
  function reflect(dock) {
    ["mode", "theme", "fontscale", "contrast", "cb"].forEach(function (g) {
      var cur = currentValue(g);
      var row = dock.querySelector('[data-group="' + g + '"]');
      if (!row) return;
      Array.prototype.forEach.call(row.querySelectorAll(".dock__btn"), function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-val") === cur);
      });
    });
  }
  function set(group, val) {
    store.set(group, val);
    if (group === "mode") { val ? html.setAttribute("data-mode", val) : html.removeAttribute("data-mode"); }
    else if (group === "theme") { applyTheme(val); }
    else if (group === "fontscale") { val ? html.setAttribute("data-fontscale", val) : html.removeAttribute("data-fontscale"); }
    else if (group === "contrast") { val ? html.setAttribute("data-contrast", val) : html.removeAttribute("data-contrast"); }
    else if (group === "cb") { val ? html.setAttribute("data-cb", val) : html.removeAttribute("data-cb"); }
  }

  /* ---- keyboard: quick shortcuts (accessibility power-users) ---- */
  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.key.toLowerCase() === "d") { var m = store.get("mode", "") === "dark" ? "light" : "dark"; set("mode", m); }
  });

  /* ---- route transition veil ---- */
  function veil() {
    var v = document.createElement("div");
    v.className = "route-veil";
    v.setAttribute("aria-hidden", "true");
    v.innerHTML = '<div class="route-veil__mark"></div>';
    document.body.appendChild(v);
    var hide = function () { v.classList.add("is-gone"); };
    window.addEventListener("load", function () { setTimeout(hide, 200); });
    // Safety net: never let the veil linger if load is slow or blocked.
    setTimeout(hide, 1800);
    if (document.readyState === "complete") hide();
    // Fade on internal navigation (progressive enhancement)
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href[0] === "#" || a.target === "_blank" || href.indexOf("http") === 0 || a.hasAttribute("data-open-cart") || a.hasAttribute("data-open-search")) return;
      if (/\.(html)?($|\?)/.test(href) || href.indexOf(".html") > -1) {
        v.classList.remove("is-gone");
      }
    });
  }

  document.documentElement.setAttribute("data-transition", "");

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { buildDock(); veil(); });
  else { buildDock(); veil(); }
})();
