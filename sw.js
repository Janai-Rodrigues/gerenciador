const CACHE_NAME = 'file-manager-cache-v1';
const urlsToCache = [
  '/',
  'index.html' 
  // Adicione aqui os ícones se quiser que eles também fiquem em cache
  // 'icon-192.png',
  // 'icon-512.png'
];

// Evento de instalação: abre o cache e armazena os arquivos principais do app
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de fetch: intercepta as requisições
// Se o recurso estiver no cache, retorna do cache. Senão, busca na rede.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna do cache
        }
        return fetch(event.request); // Busca na rede
      })
  );
});