const CACHE_NAME = 'slovenia-tourism-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
];

// @ts-ignore - Service Worker types
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// @ts-ignore - Service Worker types
self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
