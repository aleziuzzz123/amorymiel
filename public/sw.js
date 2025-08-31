const CACHE_NAME = 'amor-y-miel-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/App.jsx',
  '/src/main.jsx',
  '/public/favicon.svg',
  '/public/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '¡Nuevo producto disponible en Amor y Miel!',
    icon: '/public/favicon.svg',
    badge: '/public/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver productos',
        icon: '/public/favicon.svg'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/public/favicon.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Amor y Miel', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
