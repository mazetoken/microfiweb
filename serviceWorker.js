const staticMicrofi = "microfi-site-v1"
const assets = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./img/bitcoin-cash-logo.png",
  "./img/microfi_app.png",
  "./img/microfi_ecosystem.png",
  "./img/microfi_icon.png",
  "./img/microfi_paper.png",
  "./img/microfi_wallet.png",
  "./img/microfi_web.png",
  "./token/index.html",
  "./wallet/index.html",
  "./paperwallet/index.html",
  "./testnet/index.html",
  "./js/collapsible.js",
  "./js/payment.js",
  "./js/wallet.js",
  "./ecosystem/index.js"
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