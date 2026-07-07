// 📄 sw.js の中身を以下に丸ごと差し替え

// 1. インストールとアクティベートを即時実行させ、iPhone側に常に最新の挙動を適用する
self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});

// 2. HTML（メイン画面）から「通知を出して！」というメッセージを受け取って、Service Workerの権限でiPhoneの画面にポップアップを出す
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const title = event.data.title || "⚡ 現場連絡";
        const options = {
            body: event.data.body || "新しいメッセージがあります。",
            icon: "icon.png",
            badge: "icon.png",
            vibrate: [200, 100, 200],
            data: {
                url: self.location.origin + "/index.html"
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

// 3. 通知がタップされたらアプリの画面を開くか、開いているタブにフォーカスする
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const targetUrl = event.notification.data ? event.notification.data.url : self.location.origin + "/index.html";
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});