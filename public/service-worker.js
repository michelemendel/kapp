self.addEventListener("install", (event) => {

    console.log("[SW:install]");

    let CACHE_NAME = "kapp_cache"
    let urlsToCache = [
        "./js_data.js",
    ]
    event.waitUntil(
        /* open method available on caches, takes in the name of cache as the first parameter. It returns a promise that resolves to the instance of cache
        All the URLS above can be added to cache using the addAll method. */
        caches
        .open(CACHE_NAME)
        .then((cache) => {
            console.log("[SW:install:cache]");
            return cache.addAll(urlsToCache);
        })
    )
})

self.addEventListener("activate", (event) => {
    console.log("[SW:activate]");

    let cacheWhitelist = ["kapp_cache"] // products-v2 is the name of the new cache

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    console.log("[SW:delete]", cacheName);
                    /* Deleting all the caches except the ones that are in cacheWhitelist array */
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})