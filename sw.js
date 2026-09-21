/* Service worker อย่างง่าย : แคชเฉพาะหน้าเปลือกและไอคอน
   ข้อมูลจริงทั้งหมดดึงสดจาก Google Apps Script เสมอ ไม่แคชข้อมูลผู้ใช้ */
var CACHE = 'fieldwork-shell-v2';
var SHELL = ['./', './index.html', './manifest.json',
             './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })
    .then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).catch(function () { return caches.match(e.request); })
  );
});
