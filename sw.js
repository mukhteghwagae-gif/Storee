/* Sitara — offline shell. Caches pages and assets a shopper has already seen so
   the site still opens on a bad connection. Never caches the API. */
const CACHE = "sitara-vmtptmu7f";
const SHELL = ["/", "/index.html", "/shop.html", "/assets/css/sitara.css", "/assets/css/themes.css", "/assets/js/app.js", "/assets/js/theme.js", "/assets/js/catalog.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.pathname.startsWith("/api/")) return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const live = fetch(e.request).then((res) => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit || caches.match("/index.html"));
      return hit || live;
    })
  );
});
