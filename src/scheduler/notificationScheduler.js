const cron = require('node-cron');
const Notification = require('../models/Notification');
const { sendToQueue } = require('../services/queueProducer');

const startScheduler = () => {
  // Run every 10 seconds
  cron.schedule('*/10 * * * * *', async () => {
    try {
      const now = new Date();
      
      const readyNotifications = await Notification.find({
        status: 'scheduled',
        scheduleAt: { $lte: now }
      });

      if (readyNotifications.length > 0) {
        console.log(`Found ${readyNotifications.length} scheduled notifications ready to process`);
      }

      for (const notification of readyNotifications) {
        const payload = { notificationId: notification._id };
        await sendToQueue('notification_queue', payload);
        
        notification.status = 'pending';
        await notification.save();
      }
    } catch (error) {
      console.error('Scheduler error:', error.message);
    }
  });

  console.log('Scheduler started, polling every 10 seconds');
};

module.exports = { startScheduler };
