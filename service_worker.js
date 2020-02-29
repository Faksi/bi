var CACHE_NAME = 'my-site-cache-v3';
var urlsToCache = [
  '/',
  'fallback.json',
  '/images/logo.png',
  '/js/main.js',
  '/js/jquery-3.4.1.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     //APAKAH NAMA CACHE INI SUDAH ADA SEBELUMNYA
//     caches.match(event.request).then(function(response) {
//         // JIKA SUDAH ADA PAKE LOKAL
//         if (response) { return response; }
//         //JIKA BELUM PAKE NETWORK
//         return fetch(event.request);
//       }
//     )
//   );
// });

self.addEventListener('fetch', function(event) {

  //TAMPILKAN DATA DARI LOKAL (JIKA ADA)
  //JIKA TIDAK ADA SIMPAN DATA DARI NETWORK KE LOKAL

  var request = event.request
  var url = new URL(request.url)

  //JIKA URL SAMA DENGAN URL ORIGIN
  if(url.origin === location.origin){
    event.respondWith(
      caches.match(request).then(function(response) {
          return response || fetch(request)
      })
    )
  }else{
    //JIKA TIDAK
    event.respondWith(
      caches.open("products-cache").then(function(cache) {
          return fetch(request).then(function (liveResponse) {
            cache.put(request, liveResponse.clone())
            return liveResponse
          }).catch(function () {
            return caches.match(request).then(function (response) {
              if(response) return response
              return  caches.match('/fallback.json');
            })
          })
      })
    )
  }

});


//akan berjalan jika halamannya tertutup
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName != CACHE_NAME
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});
