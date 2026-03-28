const CACHE_NAME = 'lodaya-health-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request);
    })
  );
});

self.addEventListener('push', e => {
  let data = { title:'Lodaya Health', body:'You have a new notification.' };
  try { data = e.data ? e.data.json() : data; } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '',
      tag: data.tag || 'lodaya-health',
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type:'window', includeUncontrolled:true }).then(cls => {
      for (const c of cls) {
        if (c.url === url && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
