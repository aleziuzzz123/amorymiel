// Service Worker for Amor Y Miel - Enhanced PWA
const CACHE_NAME = 'amor-y-miel-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';
const IMAGE_CACHE = 'images-v2.0.0';
const API_CACHE = 'api-v2.0.0';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/App.css',
  '/favicon.ico',
  '/favicon.svg',
  '/public/images/logo/logo3.png',
  '/manifest.json',
  '/blog.html',
  '/articulo-velas-miel.html',
  '/articulo-conoterapia.html',
  '/faq.html',
  '/local-seo.html'
];

// Critical images to cache
const CRITICAL_IMAGES = [
  '/public/images/logo/logo3.png',
  '/public/images/service/conoterapia.jpg',
  '/public/images/service/Sanación y bendición de útero.jpg'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/services',
  '/api/coupons'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache critical images
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('🖼️ Caching critical images');
        return cache.addAll(CRITICAL_IMAGES);
      })
    ])
    .then(() => {
      console.log('✅ All assets cached successfully');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('❌ Error caching assets:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Firebase and external API calls
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis') ||
      url.hostname.includes('facebook') ||
      url.hostname.includes('googletagmanager')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('📱 Serving from cache:', request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
                console.log('💾 Cached dynamic content:', request.url);
              });

            return response;
          })
          .catch((error) => {
            console.error('❌ Network fetch failed:', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(
      // Handle offline actions when connection is restored
      handleOfflineActions()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📨 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/public/images/logo/logo3.png',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver productos',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Amor Y Miel', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/#productos')
    );
  }
});

// Helper function for offline actions
async function handleOfflineActions() {
  try {
    // Get offline actions from IndexedDB
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await processOfflineAction(action);
        await removeOfflineAction(action.id);
        console.log('✅ Processed offline action:', action.type);
      } catch (error) {
        console.error('❌ Failed to process offline action:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error handling offline actions:', error);
  }
}

// Placeholder functions for offline actions
async function getOfflineActions() {
  // Implement IndexedDB logic to get offline actions
  return [];
}

async function processOfflineAction(action) {
  // Implement logic to process offline actions
  console.log('Processing offline action:', action);
}

async function removeOfflineAction(actionId) {
  // Implement IndexedDB logic to remove processed action
  console.log('Removing offline action:', actionId);
}
