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
self.addEventListener("push", function(event) {
  console.log("[SW] PUSH RECEBIDO");

  let texto = "Teste de notificação";
  let titulo = "Controle de Carrinhos";

  if (event.data) {
    try {
      const dadosJson = event.data.json();
      titulo = dadosJson.title || titulo;
      texto = dadosJson.body || texto;
    } catch (e) {
      texto = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      titulo,
      {
        body: texto,
        icon: "./logo.png",
        badge: "./logo.png"
      }
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
  const url = new URL(event.request.url);

  /*
   * NÃO intercepta requisições externas (Google Apps Script).
   */
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
