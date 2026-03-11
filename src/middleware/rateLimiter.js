const redisClient = require('../config/redis');

const rateLimiter = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return next(); // If no userId, validation middlware or controller will reject it. We don't limit without user.
    }

    const key = `rate_limit:${userId}`;
    const requestCount = await redisClient.incr(key);

    if (requestCount === 1) {
      // Set expiration to 60 seconds
      await redisClient.expire(key, 60);
    }

    if (requestCount > 5) {
      return res.status(429).json({ error: 'Too Many Requests' });
    }

    next();
  } catch (error) {
    console.error('Rate Limiter Error:', error.message);
    next(); // Fail open so API isn't blocked if Redis goes down temporarily
  }
};

module.exports = rateLimiter;
