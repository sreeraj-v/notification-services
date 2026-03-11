let clients = [];

const sseMiddleware = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Inform client stream is open
  res.write('data: {"message":"Connected to SSE stream"}\n\n');

  const clientId = Date.now();
  clients.push({ id: clientId, res });

  req.on('close', () => {
    clients = clients.filter(client => client.id !== clientId);
  });
};

const emitNotificationEvent = (userId, notification) => {
  const data = JSON.stringify({ event: 'notification_processed', userId, notification });
  
  clients.forEach(client => {
    client.res.write(`data: ${data}\n\n`);
  });
};

module.exports = { sseMiddleware, emitNotificationEvent };
