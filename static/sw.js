const staticOften = "timely-app-site-v1"
const assets = [
  
  "/",
  "/static/sfc/main.js",
  "/static/sfc/dashboard.js",
  "/static/sfc/home.js",
  "/static/sfc/register.js",
  
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticOften).then(cache => {
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