const CACHE_NAME = "datenverwaltung-cache-v3"; // neue Versionsnummer
const urlsToCache = [
  "/datenverwaltung-app/",
  "/datenverwaltung-app/index.html",
  "/datenverwaltung-app/manifest.json",
  "/datenverwaltung-app/service-worker.js",
  // externe Libraries unverändert
];

  // externe Bibliotheken (CDN)
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"
];

// Install: Cache füllen & sofort aktiv werden
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // sofort aktiv werden
});

// Activate: Alte Caches löschen & sofort übernehmen
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
  self.clients.claim(); // übernimmt alle Seiten sofort
});

// Fetch: Cache First für alle Dateien
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// Nachricht vom Client empfangen
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});


