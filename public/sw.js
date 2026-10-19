const CACHE_NAME = "wearhaus-pwa-v1";
const OFFLINE_URL = "/offline.html";

const PRECACHE_ASSETS = [
  "/",
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Instalasi Service Worker & Precache aset esensial
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Aktivasi & Pembersihan Cache Versi Lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Penanganan Request & Strategi Caching
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Abaikan metode selain GET
  if (request.method !== "GET") {
    return;
  }

  // 2. KEAMANAN: Jangan pernah cache rute admin atau otentikasi
  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/auth")) {
    return;
  }

  // 3. Abaikan protokol selain http/https (misalnya chrome-extension)
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // 4. Navigasi Halaman HTML: Network-first dengan fallback offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Jika offline, coba ambil halaman dari cache jika pernah dikunjungi
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Jika belum ada di cache, tampilkan halaman offline informatif
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // 5. Aset Statis (CSS, JS, Gambar, Font): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.origin === self.location.origin || url.hostname.includes("fonts."))
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Jika gagal dan tidak ada di cache, biarkan error wajar
        });

      return cachedResponse || fetchPromise;
    })
  );
});

