const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Declare standard queue
    await channel.assertQueue('notification_queue', { durable: true });
    
    // Declare dead letter queue
    await channel.assertQueue('notification_dlq', { durable: true });
    
    console.log('RabbitMQ connected and queues declared');
    return channel;
  } catch (error) {
    console.error('RabbitMQ connection error:', error.message);
    process.exit(1);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
