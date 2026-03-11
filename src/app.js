require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');

const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Serve static frontend files
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// Enable JSON middleware
app.use(express.json());

app.use('/notifications', notificationRoutes);

// Setup health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Centralized error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

const { startWorker } = require('./workers/notificationWorker');
const { startScheduler } = require('./scheduler/notificationScheduler');

const startServer = async () => {
  // Initialize connection during server startup
  await connectDB();
  await connectRabbitMQ();
  
  // Start worker
  startWorker();
  
  // Start scheduler
  startScheduler();
  
  // Require redis to trigger the connection events
  require('./config/redis');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Expose app for testing later
if (require.main === module) {
  startServer();
}

module.exports = app;
