/* سرویس‌ورکر: همه‌چیز را یک بار می‌گیرد و بعد از آن اپ آفلاین کار می‌کند.
   نسخه در نام کش است، پس با هر ساخت تازه، کش قبلی پاک می‌شود. */
const CACHE = "rooz-saad-o-nahs-20261021-2340";
const FILES = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-180.png", "./icon-192.png", "./icon-512.png"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(
      ks.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* اول از کش. اگر نبود از شبکه، و همان را هم برای دفعه‌ی بعد نگه می‌دارد. */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(pasokh => pasokh || fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() => caches.match("./index.html")))
  );
});
