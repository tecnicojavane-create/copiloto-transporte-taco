const CACHE_NAME = 'copiloto-mapas-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'https://unpkg.com',
  'https://unpkg.com'
];

// Instalación inicial: Guarda los recursos críticos en el almacenamiento local
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Estrategia Cache-First con fallback de red para máxima velocidad en carretera
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).then((response) => {
        // Guardar dinámicamente imágenes de mapas (tiles) que se van cargando
        if (e.request.url.includes('tile.openstreetmap') || e.request.url.includes('basemaps.cartocdn')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, response.clone());
            return response;
          });
        }
        return response;
      });
    })
  );
});