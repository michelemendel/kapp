export function initServiceWorker() {
    /* navigator is a WEB API that allows scripts to register 
    themselves and carry out their activities. */
    if ("serviceWorker" in navigator) {
        console.log("Service Worker is supported in your browser")
        /* register method takes in the path of service worker file and returns 
        a promise, which returns the registration object */
        navigator.serviceWorker
            .register("./service-worker.js")
            .then(registration => {
                console.log("Service Worker is registered!")
            })
    } else {
        console.log("Service Worker is not supported in your browser")
    }
}