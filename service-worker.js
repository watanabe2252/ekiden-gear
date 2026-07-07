// 📄 service-worker.js （バックグラウンド通知待機用スクリプト）
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    
    let payload = {
        title: "現場掲示板新着通知",
        body: "新しい連絡事項が投稿されました。"
    };

    if (event.data) {
        try {
            payload = event.data.json();
        } catch (e) {
            payload.body = event.data.text();
        }
    }

    const options = {
        body: payload.body,
        icon: './icon.png', // PWA用のアイコンがあればここに配置
        badge: './icon.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification(payload.title, options)
    );
});

// 通知がタップされた時にアプリを開く挙動
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('./')
    );
});