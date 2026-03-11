# Notification Service

A scalable Node.js Notification Service supporting instant notifications, scheduled notifications, real-time SSE updates, and Web Push native alerts.

## Tech Stack
- **Node.js / Express** (API layer)
- **MongoDB** (Storage layer for history & subscriptions)
- **Redis** (Rate Limiter caching)
- **RabbitMQ** (Message Broker, Delayed Queues, Dead Letter Queues)
- **node-cron** (Scheduler)
- **Web Push** (Native OS browser push)
- **Server Sent Events** (Real-time live feed)
- **Tailwind CSS + HTML** (Frontend Pages)

## Quick Start (Locally without Docker)

Ensure you have **MongoDB**, **Redis**, and **RabbitMQ** installed and running on default Windows ports.

1. **Install Dependencies**
```bash
npm install
```

2. **Generate VAPID Keys**
```bash
npx web-push generate-vapid-keys
```

3. **Configure Environment**
Edit `.env` and fill in the VAPID keys generated above.
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notification_db
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672

VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
VAPID_SUBJECT=mailto:admin@example.com
```

4. **Run Server**
```bash
npm run dev
```

## Features Demo
- **User Feed**: Navigate to [http://localhost:3000/user.html](http://localhost:3000/user.html). Here you can see real-time alerts via SSE and enable native desktop pushes.
- **Admin Panel**: Navigate to [http://localhost:3000/admin.html](http://localhost:3000/admin.html) to trigger immediate or scheduled alerts to specific users. IMPORTANT USE "testUser123" (as userId) IN THE UserId FIELD TO RECEIVE NOTIFICATIONS OTHERWISE YOU NEED TO CHANGE THE "Listening as" FIELD TO REQUIRED UserId IN THE USER FEED PAGE FOR GETTING PROPER RESPONSE .

## Example Images 

<img width="1920" height="921" alt="Screenshot (252)" src="https://github.com/user-attachments/assets/86b6bb68-3446-478e-897a-1d7150e26a43" />

<img width="1920" height="903" alt="Screenshot (251)" src="https://github.com/user-attachments/assets/e81517f3-82fc-4086-a8a6-fe83db7548f5" />





