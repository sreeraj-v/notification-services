const PushSubscription = require('../models/PushSubscription');

const getVapidPublicKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

const subscribeUser = async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    
    if (!userId || !subscription) {
      return res.status(400).json({ error: 'userId and subscription are required' });
    }

    const { endpoint, keys } = subscription;
    if (!keys || !keys.p256dh || !keys.auth) {
       return res.status(400).json({ error: 'Invalid subscription object' });
    }

    const payload = {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth
    };

    const updated = await PushSubscription.findOneAndUpdate(
      { userId },
      payload,
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Subscription saved successfully.', data: updated });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getVapidPublicKey, subscribeUser };
