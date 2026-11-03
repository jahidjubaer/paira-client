// Service worker: makes the site installable and fast on repeat visits.
// - Pages: network first, fall back to the cached app shell when offline
// - Built JS/CSS (/assets, hashed names): cache first
// - Images, icons, fonts: show cached copy, refresh in the background
// - API calls, /version.json and other sites' requests are never cached
// 'paira-v1' is replaced with a per-build name by vite.config.js (buildStamp)
const VERSION = 'paira-v1'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/hero-takerghat.svg', '/icons/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

const isFont = (url) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  const sameOrigin = url.origin === self.location.origin
  if ((!sameOrigin && !isFont(url)) || url.pathname.startsWith('/api') || url.pathname === '/version.json') return

  // Page navigations: try the network, fall back to the app shell offline
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')))
    return
  }

  // Hashed build files never change: cache first
  if (sameOrigin && url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) caches.open(VERSION).then((c) => c.put(request, res.clone()))
            return res
          }),
      ),
    )
    return
  }

  // Everything else (images, icons, fonts): stale-while-revalidate
  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((res) => {
          if (res.ok || res.type === 'opaque') caches.open(VERSION).then((c) => c.put(request, res.clone()))
          return res
        })
        .catch(() => hit)
      return hit || network
    }),
  )
})
