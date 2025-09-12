self.addEventListener('install', event => {
  console.log('Service Worker installiert');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker aktiviert');
});

self.addEventListener('fetch', event => {
  // Einfach nur Netzwerk weiterleiten
  event.respondWith(fetch(event.request).catch(() => {
    // Optional: offline fallback kann hier definiert werden
    return new Response('Offline verfügbar nicht verfügbar.', {status:503});
  }));
});



