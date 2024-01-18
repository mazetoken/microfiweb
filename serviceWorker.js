const staticMicrofi = "microfi-site-v1"
const assets = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/img/coffee1.jpg",
  "/img/coffee2.jpg",
  "/img/coffee3.jpg",
  "/img/coffee4.jpg",
  "/img/coffee5.jpg",
  "/img/coffee6.jpg",
  "/img/coffee7.jpg",
  "/img/coffee8.jpg",
  "/img/coffee9.jpg",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticMicrofi).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
})