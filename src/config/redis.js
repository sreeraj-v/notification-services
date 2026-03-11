const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL, {
  retryStrategy(times) {
    // Implement connection retry logic
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

module.exports = redisClient;
