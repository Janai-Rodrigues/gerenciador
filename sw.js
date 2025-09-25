// Define um nome e versão para o cache
const CACHE_NAME = 'file-manager-v1';

// Lista de arquivos essenciais para o app funcionar offline
const urlsToCache = [
  '/',
  'index.html',
  // Adicione aqui os caminhos para os seus ícones quando os criar
  'icon-192.png',
  'icon-512.png'
];

// Evento de Instalação: Salva os arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de Fetch: Intercepta as requisições
// Se o recurso estiver no cache, entrega a versão do cache.
// Se não, busca na rede, salva no cache e entrega.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna a resposta do cache
        if (response) {
          return response;
        }

        // Se não, busca na rede
        return fetch(event.request).then(
          response => {
            // Verifica se recebemos uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta. Uma resposta é um "Stream" e só pode ser consumida uma vez.
            // Precisamos de uma cópia para o navegador e outra para o cache.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
