//import {CacheableResponsePlugin} from 'workbox-cacheable-response';



if ("function" === typeof importScripts) {

    console.log(1234);
    importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js");

   console.log(workbox);
    // Global workbox
    if (workbox) {

        console.log("Workbox is loaded");
        // Disable logging
        workbox.setConfig({ debug: true });
        //`generateSW` and `generateSWString` provide the option
        // to force update an exiting service worker.
        // Since we're using `injectManifest` to build SW,
        // manually overriding the skipWaiting();
        self.addEventListener("install", event => {
            self.skipWaiting();
           window.location.reload();
        });
        // Manual injection point for manifest files.
        // All assets under build/ and 5MB sizes are precached.
        workbox.precaching.precacheAndRoute([]);
        // Font caching

        workbox.routing.registerRoute(
            new RegExp('^https://tiles\\.arcgis\\.com'),
            workbox.strategies.cacheFirst({
                cacheName: 'image-cache',
                plugins: [
                    new workbox.cacheableResponse.Plugin({
                        statuses: [0, 200],
                    })
                ]
            })
        );


        // Image caching
        workbox.routing.registerRoute(
            /\.(?:png|gif|jpg|jpeg|svg)$/,
            workbox.strategies.cacheFirst({
                cacheName: "images",
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 60,
                        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
                    })
                ]
            })
        );
        // JS, CSS caching
        workbox.routing.registerRoute(
            /\.(?:js|css)$/,
            workbox.strategies.staleWhileRevalidate({
                cacheName: "static-resources",
                plugins: [
                    new workbox.expiration.Plugin({
                        maxEntries: 60,
                        maxAgeSeconds: 20 * 24 * 60 * 60 // 20 Days
                    })
                ]
            })
        );

    } else {

        console.error("Workbox could not be loaded. No offline support");

    }
}