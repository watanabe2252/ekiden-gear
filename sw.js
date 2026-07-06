// 📄 sw.js (新規作成)

// プッシュ通知を受け取った時のイベントリスナー
self.addEventListener('push', function(event) {
    if (!event.data) return;

    // Edge Functions から送られてきたテキストを解析
    let data = {};
    try {
        data = event.data.json();
    } catch (e) {
        data = { title: "現場掲示板", body: event.data.text() };
    }

    const title = data.title || "⚡ 現場掲示板の新着投稿";
    const options = {
        body: data.body || "新しいメッセージがあります。",
        icon: "icon.png", // アプリのアイコンがあれば指定
        badge: "icon.png",
        vibrate: [200, 100, 200], // スマホのバイブレーションパターン
        data: {
            url: self.location.origin + "/index.html" // 通知をタップした時の遷移先
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 通知がタップされた時の処理
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // 通知を閉じる
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // すでにアプリが開いている場合はそこにフォーカス、なければ新しく開く
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});