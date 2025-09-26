// Minimal offline-first service worker (cache-first for same-origin GET)
const CACHE = 'av-cache-v1';
self.addEventListener('install', (e) => {
  e.waitUntil((async ()=>{
    const cache = await caches.open(CACHE);
    await cache.addAll(['/']);
  })());
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async ()=>{
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    if (cached) return cached;
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  })());
});