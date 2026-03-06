// BPBS Service Worker — Cache-first for static assets, network-first for API

const CACHE_NAME = "bpbs-v1";
const STATIC_ASSETS = [
    "/",
    "/login",
    "/japa",
    "/kirtan",
    "/manifest.json",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET and API routes — always network
    if (request.method !== "GET" || url.pathname.startsWith("/api/")) {
        return;
    }

    // Cache-first for static (_next/static, fonts, images)
    if (
        url.pathname.startsWith("/_next/static") ||
        url.pathname.startsWith("/icons") ||
        url.hostname === "fonts.googleapis.com" ||
        url.hostname === "fonts.gstatic.com"
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                return cached || fetch(request).then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                });
            })
        );
        return;
    }

    // Network-first for pages — fall back to cache if offline
    event.respondWith(
        fetch(request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                return response;
            })
            .catch(() => caches.match(request))
    );
});

self.addEventListener("push", (event) => {
    const data = event.data ? event.data.json() : {};
    self.registration.showNotification(data.title || "BPBS", {
        body: data.body || "Hare Krishna! 🙏",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
    });
});
