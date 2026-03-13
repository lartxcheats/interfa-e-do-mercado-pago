const CACHE_NAME = 'mercadopago-v2';
const urlsToCache = [
  '/banco-fake/mercadopago.html',
  '/banco-fake/mercadopago.css',
  '/banco-fake/mercadopago.js',
  '/banco-fake/logomp.png',
  '/banco-fake/casinha.png',
  '/banco-fake/catao.png',
  '/banco-fake/pix2.png',
  '/banco-fake/pagamento.png',
  '/banco-fake/mais.png',
  '/banco-fake/images.png',
  '/banco-fake/cartao.jpeg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
