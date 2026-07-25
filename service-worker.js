// ==============================
// WeightNote Pro Service Worker
// service-worker.js
// ==============================

// 앱을 수정해서 배포할 때 캐시 버전을 올려주세요.
// 예: v8 → v9 → v10
const CACHE_NAME = "weightnote-pro-v9";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];


// ==============================
// 설치
// ==============================

self.addEventListener("install", event => {

    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    // 새 서비스워커 즉시 대기 상태 해제
    self.skipWaiting();
});


// ==============================
// 활성화
// 이전 캐시 삭제
// ==============================

self.addEventListener("activate", event => {

    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {

                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            })
    );

    // 열려 있는 페이지를 새 서비스워커가 바로 제어
    self.clients.claim();
});


// ==============================
// 네트워크 우선
// 최신 파일을 먼저 가져오고
// 실패하면 캐시 사용
// ==============================

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    // 다른 사이트 요청은 건드리지 않음
    const requestUrl = new URL(event.request.url);

    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {

                // 정상 응답만 캐시에 저장
                if (response && response.status === 200) {

                    const responseCopy =
                        response.clone();

                    caches
                        .open(CACHE_NAME)
                        .then(cache => {
                            cache.put(
                                event.request,
                                responseCopy
                            );
                        });
                }

                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
