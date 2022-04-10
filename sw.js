const staticCacheName = 'site-static'
// store request url and get resource and store in cache
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
]

// install service worker
// self => service worker
self.addEventListener('install', event => {
  console.log('service worker has been installed')
  // wait until sw is installed 
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      // cache.add() add one item
      console.log('caching shell assets')
      cache.addAll(assets)
    })
  )
})

// in waiting => to activate the service worker
// activate
self.addEventListener("activate", event => {
  console.log("Service worker activated");
})

// fetch event
// sw as a proxy connect to server
// sw can response from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      return cacheRes || fetch(event.request)
    })
  )
})


