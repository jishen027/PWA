const staticCacheName = 'site-static-v6'

const dynamicCacheName = 'site-dynamic-cache-v8'
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
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html'
]

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}

// install service worker
// self => service worker
self.addEventListener('install', event => {
  console.log('service worker has been installed')
  // wait until cache is added
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
  // delete old cache
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key)))
    })
  )
})

// fetch event
// sw as a proxy connect to server
// sw can response from cache
// offline actions
self.addEventListener('fetch', event => {
  if (event.request.url.indexOf('firestore.googleapis.com') === -1) {
    event.respondWith(
      // look for cache if the page exist
      caches.match(event.request).then(cacheRes => {
        // if cache has the resource then return the resource
        // if don't have this it will try to fetch resource from server
        return cacheRes || fetch(event.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            // cache.put() will get resource from cache not from server
            cache.put(event.request.url, fetchRes.clone())
            // check cache size
            limitCacheSize(dynamicCacheName, 2)
            return fetchRes
          })
        })
      }).catch(() => {
        if (event.request.url.indexOf('.html') > -1) {
          return caches.match('/pages/fallback.html')
        }
      })
    )
  }

})


