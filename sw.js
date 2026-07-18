const CACHE_NAME = 'mundo-yoyo-v6';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './stars.js',
    './tts.js',
    './sounds.js',
    './yoyo-mascot.js',
    './transitions.js',
    './achievements.js',
    './game-engine.js',
    './admin.js',
    './manifest.json',
    './icon.svg',
    './silabas.html',
    './silabas.js',
    './numeros.html',
    './contar.html',
    './contar.js',
    './vestir.html',
    './vestir.js',
    './vestir-icons.js',
    './domino.html',
    './domino.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {}))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request).then(cached => {
            return cached || fetch(e.request).then(resp => {
                const clone = resp.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone)).catch(() => {});
                return resp;
            }).catch(() => cached);
        })
    );
});
