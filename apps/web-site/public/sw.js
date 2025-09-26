// Stage 16 SW — Stale-While-Revalidate for static & navigation
const CACHE='av-cache-v1';
self.addEventListener('install', e=>{self.skipWaiting();});
self.addEventListener('activate', e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (e.request.method!=='GET') return;
  if (url.origin===location.origin && (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/static/') || url.pathname.match(/\.(?:js|css|png|jpg|jpeg|svg|ico)$/))) {
    e.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(e.request);const fetchP=fetch(e.request).then(r=>{cache.put(e.request,r.clone());return r;});return cached||fetchP;})());
    return;
  }
  if (e.request.mode==='navigate') {
    e.respondWith((async()=>{try{return await fetch(e.request);}catch{const cache=await caches.open(CACHE);return await cache.match('/');}})());
  }
});
