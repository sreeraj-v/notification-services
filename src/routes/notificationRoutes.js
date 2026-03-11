const express = require('express');
const { createNotification } = require('../controllers/notificationController');
const { getVapidPublicKey, subscribeUser } = require('../controllers/subscriptionController');
const rateLimiter = require('../middleware/rateLimiter');
const { sseMiddleware } = require('../services/sseService');

const router = express.Router();

// GET /notifications/stream
router.get('/stream', sseMiddleware);

// GET /notifications/vapidPublicKey
router.get('/vapidPublicKey', getVapidPublicKey);

// POST /notifications/subscribe
router.post('/subscribe', subscribeUser);

// POST /notifications
router.post('/', rateLimiter, createNotification);

module.exports = router;
