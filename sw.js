// Importa os scripts do Firebase necessários
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyADjX2IrWrEHjYIxQjr-jzuyvHlwU9DQKE",
  authDomain: "carrinho-village-controle.firebaseapp.com",
  projectId: "carrinho-village-controle",
  storageBucket: "carrinho-village-controle.firebasestorage.app",
  messagingSenderId: "680890955138",
  appId: "1:680890955138:web:ee16694100af20fb208b9b"
});

const messaging = firebase.messaging();

// Captura direta de eventos push do Firebase (Garante que exibe mesmo com o app fechado)
self.addEventListener('push', function(event) {
  if (!event.data) return;

  let notificationTitle = "Carrinho Village";
  let notificationBody = "Nova notificação recebida.";

  try {

    // Mensagem enviada pelo Firebase
    const data = event.data.json();

    notificationTitle =
      data.notification?.title ||
      data.data?.title ||
      notificationTitle;

    notificationBody =
      data.notification?.body ||
      data.data?.body ||
      notificationBody;

  } catch (erro) {

    // Mensagem simples enviada pelo Chrome DevTools
    notificationBody =
      event.data.text() ||
      notificationBody;

  }

  const notificationOptions = {
    body: notificationBody,
    icon: './logo.png',
    badge: './logo.png'
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationTitle,
      notificationOptions
    )
  );
});

// Lida com cliques na notificação
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/carrinho-village/');
      }
    })
  );
});

// ==========================================
// CACHE E PWA
// ==========================================

const CACHE = "carrinho-village-v4";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
