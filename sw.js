/*
 * sw.js — funzionamento offline.
 * Pagine, stili e script: prima la rete (contenuti sempre aggiornati), se manca la connessione la copia salvata.
 * Font: prima la copia salvata.
 */
var CACHE = "scuola-v2";
var CORE = [
  "./", "index.html", "cerca.html", "ripasso.html", "componenti.html",
  "assets/css/style.css?v=2", "assets/js/site.js?v=2", "assets/js/layout.js?v=2",
  "assets/js/components.js?v=2", "assets/js/search.js?v=2", "assets/js/ripasso.js?v=2",
  "assets/img/icon.svg", "manifest.webmanifest",
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// La pagina invia l'elenco di tutte le pagine del sito: le salviamo per l'uso offline.
self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "precache" && Array.isArray(e.data.urls)) {
    caches.open(CACHE).then(function (c) {
      e.data.urls.forEach(function (u) {
        c.match(u).then(function (hit) { if (!hit) c.add(u).catch(function () {}); });
      });
    });
  }
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);

  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { c.put(req, res.clone()); return res; });
      });
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(req).then(function (res) {
      if (res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req, { ignoreSearch: req.mode === "navigate" }).then(function (hit) {
        return hit || caches.match("index.html");
      });
    })
  );
});
