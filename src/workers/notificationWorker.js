const { getChannel } = require('../config/rabbitmq');
const Notification = require('../models/Notification');
const PushSubscription = require('../models/PushSubscription');
const { sendPushNotification } = require('../services/webPushService');

// Stub for SSE service to avoid circular dependency / missing file issues right now
let emitNotificationEvent = null;
try {
  const sseService = require('../services/sseService');
  emitNotificationEvent = sseService.emitNotificationEvent;
} catch (e) {
  // Ignore until sseService is built
}

const startWorker = async () => {
  const channel = getChannel();
  if (!channel) {
    console.error('RabbitMQ channel not available for worker');
    return;
  }

  const queue = 'notification_queue';
  const dlq = 'notification_dlq';

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const payload = JSON.parse(msg.content.toString());
        const { notificationId } = payload;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
          console.warn(`Notification not found: ${notificationId}`);
          channel.ack(msg);
          return;
        }

        const subscription = await PushSubscription.findOne({ userId: notification.userId });
        if (!subscription) {
          console.warn(`No push subscription found for user: ${notification.userId}. Skipping web push, but will emit SSE.`);
        }

        const pushPayload = {
          title: notification.title,
          message: notification.message,
          timestamp: new Date().toISOString()
        };

        try {
          if (subscription) {
            await sendPushNotification(subscription, pushPayload);
          }
          notification.status = 'sent';
          notification.sentAt = new Date();
          await notification.save();
          
          if (emitNotificationEvent) {
             emitNotificationEvent(notification.userId, notification);
          }
          
          channel.ack(msg);
        } catch (sendError) {
          console.error(`Push send error for ${notificationId}:`, sendError.message);
          
          notification.retryCount += 1;
          
          if (notification.retryCount >= 3) {
            notification.status = 'failed';
            await notification.save();
            
            // Move to Dead Letter Queue
            channel.sendToQueue(dlq, msg.content, { persistent: true });
            
            console.log(`Notification ${notificationId} moved to DLQ after 3 failures`);
            channel.ack(msg); 
          } else {
            await notification.save();
            // Requeue the message at the back of the queue
            channel.ack(msg);
            channel.sendToQueue(queue, msg.content, { persistent: true });
          }
        }
      } catch (err) {
        console.error('Error processing message:', err.message);
        channel.ack(msg); 
      }
    }
  });

  console.log('Worker listening on notification_queue');
};

module.exports = { startWorker };
