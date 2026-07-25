const CACHE_NAME = "weightnote-v3";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];


// 새 버전 설치

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES))
    );

    self.skipWaiting();
});


// 이전 버전 캐시 삭제

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))

            );
        })

    );

    self.clients.claim();
});


// 최신 파일 우선

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(event.request)

            .then(response => {

                const copy = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, copy);
                    });

                return response;
            })

            .catch(() => {
                return caches.match(event.request);
            })

    );
});
