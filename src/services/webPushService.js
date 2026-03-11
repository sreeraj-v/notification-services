const webpush = require('web-push');

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn('VAPID keys not fully configured in .env. Web Push might fail.');
}

const sendPushNotification = async (subscriptionDoc, payload) => {
  const pushSubscription = {
    endpoint: subscriptionDoc.endpoint,
    keys: {
      p256dh: subscriptionDoc.p256dh,
      auth: subscriptionDoc.auth
    }
  };

  return webpush.sendNotification(pushSubscription, JSON.stringify(payload));
};

module.exports = { sendPushNotification };
