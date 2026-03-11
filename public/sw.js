self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch(e) {
            console.error('Push data is not JSON. Data:', event.data.text());
        }
    }
    const title = data.title || 'New Notification';
    const message = data.message || 'You have a new alert!';
    
    const options = {
        body: message,
        icon: 'https://cdn-icons-png.flaticon.com/512/3541/3541850.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3541/3541850.png',
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // Open the user feed when notification is clicked
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes('/user.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/user.html');
            }
        })
    );
});
