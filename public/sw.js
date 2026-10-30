// Service Worker for SMP Islam Walisongo 2 Depok (PWA / WebAPK Engine)
const CACHE_NAME = 'smpi-walisongo2-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/mobile',
  '/profil',
  '/ppdb',
  '/portal',
  '/static/css/style.css',
  '/static/css/mobile.css',
  '/static/js/app.js',
  '/static/js/ppdb.js',
  '/static/js/chat-ai.js',
  '/static/images/logo-sekolah.png',
  '/static/images/icon-192.png',
  '/static/images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
