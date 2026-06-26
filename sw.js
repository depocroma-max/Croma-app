// Service Worker — Croma App
const CACHE = 'croma-app-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.json']))
  );
});

self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => clients.claim())
));

self.addEventListener('fetch', e => {
  // Para el index.html siempre buscar en red primero, caché como fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Resto: caché primero
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
