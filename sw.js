importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyADjX2IrWrEHjYIxQjr-jzuyvHlwU9DQKE",
  authDomain: "carrinho-village-controle.firebaseapp.com",
  projectId: "carrinho-village-controle",
  storageBucket: "carrinho-village-controle.firebasestorage.app",
  messagingSenderId: "680890955138",
  appId: "1:680890955138:web:ee16694100af20fb208b9b"
});

const messaging = firebase.messaging();

// Notificações recebidas em background
messaging.onBackgroundMessage((payload) => {

  console.log("Push recebido:", payload);

  const notificationTitle =
    payload.notification?.title ||
    "Controle de Carrinhos";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "Você possui um lembrete de designação.",
    icon: "./logo.png",
    badge: "./logo.png"
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );

});

// Clique na notificação
self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  event.waitUntil(
    clients.openWindow(
      "/carrinho-village/"
    )
  );

});

// ======================
// PWA CACHE
// ======================

const CACHE = "carrinho-village-v5";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png"
];

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );

});

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )

  );

});

self.addEventListener("fetch", (event) => {

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(

    caches.match(event.request)
      .then(response => response || fetch(event.request))

  );

});
