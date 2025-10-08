const CACHE = 'icfmx-v7';
const ASSETS = ['/', '/manifest.webmanifest', '/icons/app-192.png', '/icons/app-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.url.includes('/api/')) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
  } else {
    e.respondWith(caches.match(req).then(res => res || fetch(req)));
  }
});
