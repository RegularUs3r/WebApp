const VERSION = 'v1';
const SHELL = `shell-${VERSION}`;
const PRECACHE = ['/offline.html', '/images/icon-192.png', '/images/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL).then(function (cache) {
      // allSettled: a single 404 no longer aborts the whole install
      return Promise.allSettled(PRECACHE.map(function (url) {
        return cache.add(url);
      }));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // Never touch: non-GET, other origins, API, auth
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname === '/mfa' ||
      url.pathname === '/validateMFA') return;

  // Pages: always go to the network so auth redirects still work; offline fallback
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/offline.html')));
    return;
  }

  // Static JS/CSS/images: stale-while-revalidate
  if (/^\/(scripts|styles|images)\//.test(url.pathname)) {
    e.respondWith(
      caches.open(SHELL).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req).then((res) => {
          if (res.ok && !res.redirected) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
