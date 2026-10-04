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

  const data = event.data.json();
  const notificationTitle = data.notification?.title || "Carrinho Village";
  const notificationOptions = {
    body: data.notification?.body || "Nova notificação recebida.",
    icon: './logo.png'
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
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

const CACHE = "carrinho-village-v3";

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

self.addEventListener("fetch", event => {
  ifSe mesmo após adicionar o código de fundo a notificação não apareceu, o próximo passo essencial é **verificar se o Service Worker chegou a receber o sinal** do Firebase. 

Como o Service Worker roda num processo separado da página web, os erros ou logs dele aparecem numa consola própria.

### Como verificar o Service Worker:

1. No seu navegador, abra uma nova aba e digite:
   ```text
   chrome://inspect/#service-workers
