// Importa os scripts do Firebase necessários para o Service Worker funcionar em background
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Inicialize o Firebase no Service Worker com os seus dados reais
firebase.initializeApp({
  apiKey: "AIzaSyADjX2IrWrEHjYIxQjr-jzuyvHlwU9DQKE",
  authDomain: "carrinho-village-controle.firebaseapp.com",
  projectId: "carrinho-village-controle",
  storageBucket: "carrinho-village-controle.firebasestorage.app",
  messagingSenderId: "680890955138",
  appId: "1:680890955138:web:ee16694100af20fb208b9b"
});

const messaging = firebase.messaging();

// Opcional: Lida com cliques na notificação recebida em background
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
        return clients.openWindow('/');
      }
    })
  );
});


// ==========================================
// CONFIGURAÇÃO DE CACHE E PWA
// ==========================================

const CACHE = "carrinho-village-v2";

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
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // A API nunca deve vir do cache.
  if (url.href.includes("script.google.com")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
    );
    return;
  }

  // Para o aplicativo, tenta buscar a versão nova primeiro.
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.ok) {
          const clone = response.clone();

          caches.open(CACHE).then(cache => {
            cache.put(event.request, clone);
          });
        }

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
