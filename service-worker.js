const CACHE_NAME = "datenverwaltung-cache-v2"; // neue Versionsnummer setzen!

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",

  // externe Bibliotheken (CDN)
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"
];

// Install: Cache füllen
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  // ⚠️ self.skipWaiting(); entfernt, Update erfolgt nur nach Nutzerfreigabe
});

// Fetch: Cache-First, dann Netzwerk
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

// Activate: Alte Caches löschen
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  // ⚠️ self.clients.claim(); entfernt, Kontrolle erst nach Freigabe
});

// 👉 Nachric
