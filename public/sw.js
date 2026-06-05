const CACHE_NAME = 'edison-cache-v1';
const ASSETS = [
  '/',
  '/school-logo.jpg',
  '/manifest.json'
];

const isLocal = self.location.hostname === 'localhost' || 
                 self.location.hostname === '127.0.0.1' || 
                 self.location.hostname.startsWith('192.168.');

self.addEventListener('install', (e) => {
  self.skipWaiting();
  if (isLocal) return;
  
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (isLocal || key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (e) => {
  if (isLocal) return; // Bypass intercepting requests in development to prevent HMR reload loops
  
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(e.request);
    })
  );
});
