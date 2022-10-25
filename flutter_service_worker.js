'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "9b8548722500ea4d72a0cc65fa451be0",
"index.html": "ca22ef3c4609c645d8b0b4ee86f1fb2e",
"/": "ca22ef3c4609c645d8b0b4ee86f1fb2e",
"main.dart.js": "a0bb7b34669812f6266b33bb488c9afd",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "6f2c5935800e72142025ae622dffb9b6",
"assets/AssetManifest.json": "74ecec4b1dfeefa4fbef89d47f0cc47a",
"assets/NOTICES": "702835032c46d9ca1adac691a7fba023",
"assets/FontManifest.json": "3145e009915b9fa9d8319e219e171723",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/shaders/ink_sparkle.frag": "3cc34b0da735f765111cbce9482b0798",
"assets/fonts/Montserrat/Montserrat-Bold.otf": "9c71d42b6a840ecfda8fc555040a1c76",
"assets/fonts/Montserrat/Montserrat-Regular.otf": "92db9a0772b3732e6d686fec3711af42",
"assets/fonts/Montserrat/Montserrat-SemiBold.otf": "bb3740d350b0186ce32b5678972bf061",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/fonts/Poppins/Poppins-Medium.ttf": "ba95810b56f476990ca71d15139d5111",
"assets/fonts/Poppins/Poppins-Bold.ttf": "c23534acbeddbaadfd0ab2d2bbfdfc84",
"assets/fonts/Poppins/Poppins-SemiBold.ttf": "342ba3d8ac29ac8c38d7cef8efbf2dc9",
"assets/assets/resources/preguntas.json": "4f8f4f443d3e013ab94a6f83b516d854",
"assets/assets/icons/icon.png": "2667f21df4270b328954af4624785490",
"assets/assets/icons/preguntas_frecuentes.png": "c75eb5d8a5b9bdee9230483177a1cbec",
"assets/assets/icons/fases.png": "829f203f4fd74600cd4c0ae04afdf4a6",
"assets/assets/icons/menu_icon.png": "e3be0abbaf9fe3cb11cdc0159c4942a1",
"assets/assets/icons/cross_creditos.png": "83fd10bc3759d4ad08b4d42e8e92ae2d",
"assets/assets/icons/recursos.png": "6eed04fd9018ed0d0ea6d9dd1d4ca977",
"assets/assets/icons/igualdad.png": "14c3b2c6486bc50b574fee4d2e724448",
"assets/assets/icons/intro.png": "6750907e8c87a31b1b456ce8b2b18126",
"assets/assets/icons/splash_icon.png": "8b3c12a9cf4f39055603965eee785182",
"assets/assets/icons/diagnostico.png": "1d57dedc2f63b5ee6b3f403ff7d830bc",
"assets/assets/icons/mide_igualdad.png": "7722b0b4ad0dbd08e7a3e679b8b01978",
"assets/assets/icons/creditos.png": "4ab13d7fffaba19fea5c7020f452b40b",
"assets/assets/icons/medidas.png": "997e7d20439425b26c73343a58f62ed6",
"assets/assets/icons/icono_credito.png": "855dc6d46970be9216aa9b124c825842",
"assets/assets/icons/contacta.png": "1e9b8a911ed1be4568b6d0087ff727c6",
"assets/assets/icons/indice.png": "7b816f8f2d1e630c8d42195a2137787f",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
