// Importa os scripts do Firebase necessários para o Service Worker funcionar em background
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Inicialize o Firebase no Service Worker (certifique-se de usar os mesmos dados do seu projeto)
firebase.initializeApp({
  apiKey: "SEU_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "carrinho-village-controle",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "680890955138", // ID do remetente obtido do painel
  appId: "SEU_APP_ID"
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
