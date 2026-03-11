const Notification = require('../models/Notification');
const { sendToQueue } = require('../services/queueProducer');

const createNotification = async (req, res) => {
  try {
    const { userId, title = 'Notification', message, scheduleAt } = req.body;

    // Validate request body
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    // Determine status based on scheduleAt
    const status = scheduleAt ? 'scheduled' : 'pending';

    // Create notification document
    const notification = new Notification({
      userId,
      title,
      message,
      status,
      scheduleAt: scheduleAt ? new Date(scheduleAt) : undefined,
    });

    // Save notification to MongoDB
    await notification.save();

    // Send job to RabbitMQ for immediate notifications
    if (status === 'pending') {
      const payload = { notificationId: notification._id };
      await sendToQueue('notification_queue', payload);
    }

    // Return success response
    res.status(201).json({
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createNotification };
