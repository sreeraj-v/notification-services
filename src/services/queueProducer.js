const { getChannel } = require('../config/rabbitmq');

const sendToQueue = async (queueName, payload) => {
  const channel = getChannel();
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }

  const messageBuffer = Buffer.from(JSON.stringify(payload));
  // Send message to queue
  const success = channel.sendToQueue(queueName, messageBuffer, { persistent: true });
  return success;
};

module.exports = { sendToQueue };
