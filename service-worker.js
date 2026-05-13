const CACHE_NAME = "datenverwaltung-cache-v4";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting(); // sofort aktiv
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // sofort übernehmen
});

// FETCH (WICHTIG: Network First für HTML!)
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // HTML immer aktuell halten
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request));
    return;
  }

  // Rest: Cache + Fallback
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
