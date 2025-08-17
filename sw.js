const CACHE_NAME='mood-journal-v8';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('mood-journal-v7').then(cache => {
      return cache.addAll(['/', '/index.html', '/styles.css', '/app.js', '/daily-quote.vanilla.js']);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
