// 📄 sw.js (Vercel上)
self.addEventListener('push', function(event) {
    if (!event.data) return;
    let data = {};
    try { data = event.data.json(); } catch (e) { data = { title: "現場連絡", body: event.data.text() }; }

    const title = data.title || "⚡ 現場連絡";
    const options = {
        body: data.body || "新しいメッセージがあります。",
        icon: "icon.png",
        badge: "icon.png",
        vibrate: [200, 100, 200],
        data: { url: self.location.origin + "/index.html" }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if (client.url === event.notification.data.url && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(event.notification.data.url);
        })
    );
});