const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = ["/", "/home", "/dashboard"]; // 关键页面

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
