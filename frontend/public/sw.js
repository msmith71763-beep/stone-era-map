// Self-unregistering kill switch.
// Any browser that previously registered the old service worker will pick
// this up on next visit; it purges all caches, unregisters itself, and
// forces a fresh reload so the app runs directly from the network again.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    } catch (_) { /* noop */ }
    try {
      await self.registration.unregister();
    } catch (_) { /* noop */ }
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(c => { try { c.navigate(c.url); } catch (_) {} });
    } catch (_) { /* noop */ }
  })());
});

// Pass every request straight through to the network — no caching.
self.addEventListener('fetch', () => { /* noop */ });
