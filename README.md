# Orbit — Uptime Monitoring Platform

A full-stack uptime monitoring system that tracks website availability, measures response latency, and alerts users in real time when a service goes down.

**Live Demo:** [orbit.sketch.qzz.io](https://orbit.sketch.qzz.io) &nbsp;|&nbsp; **Backend:** [orbitbackend.sketch.qzz.io](https://orbitbackend.sketch.qzz.io)

![Dashboard](./assets/dashboard.png)

---

## Architecture

```
Client  ──api/v1/*──►  Express API  ──────────────────────►  Postgres DB
          ◄──SSE──                                                 ▲
                           │ subscribe                             │
                           ▼                                       │
                       Redis Pub/Sub                               │
                      (monitor-updates)                            │
                           ▲                                       │
                           │ publish               store ping data │
                           │                                       │
Producer (cron)  ──►  Redis Stream  ──►  Consumer  ───────────────┘
                      (Status Queue)      │
                                          │ check website status
                                          ▼
                                   https://target.com
                                          
                      Postgres DB  ──►  Outbox Worker  ──►  Redis Stream  ──►  Notification Worker  ──►  Email
                    (open incidents)    (cron/2 min)       (Alert Queue)
```

**Four async workers handle all monitoring logic:**

- **Producer** — cron job runs every 5/10/15/20 min (based on monitor interval), pushes active monitors into a Redis Stream using clock-alignment scheduling
- **Consumer** — reads from the stream in batches, performs HTTP health checks, writes results to Postgres in a single transaction, publishes status updates via Redis Pub/Sub
- **Outbox Worker** — polls open incidents every 2 minutes, applies 3-tier email escalation, pushes to alert queue (solves dual-write problem)
- **Notification Worker** — reads from alert queue, sends emails via SMTP

Real-time dashboard updates flow: Consumer → Redis Pub/Sub → Express SSE → Browser, with no client-side polling.

---

## Features

- Monitor any HTTP/HTTPS endpoint with configurable check intervals (5, 10, 15, 20 min)
- Real-time status updates and latency graph via Server-Sent Events
- Incident management with Open / Acknowledged / Resolved states
- 3-tier email escalation (primary → escalation email 1 → escalation email 2)
- 30-day uptime heatmap and response time history
- Google OAuth login
- Consecutive failure threshold (2 checks) before incident is created to avoid flapping alerts

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Zustand, Recharts, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Prisma ORM with driver adapter) |
| Queue / Pub-Sub | Redis Streams, Redis Pub/Sub |
| Real-time | Server-Sent Events (SSE) |
| Auth | Google OAuth 2.0 + JWT |
| Email | Nodemailer (SMTP) |
| Containerization | Docker, Docker Compose |

---

## Running Locally

### Prerequisites

- Docker and Docker Compose installed
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech))
- Google OAuth credentials ([console.cloud.google.com](https://console.cloud.google.com))
- SMTP credentials for email alerts

### 1. Clone the repository

```bash
git clone https://github.com/ankitpwr/Orbit.git
cd Orbit
```

### 2. Configure environment variables

Create `client/.env`:

```env
VITE_CLIENT_ID=your_google_client_id
VITE_BACKEND_URL=http://localhost:3001/api/v1
```

Create `server/.env`:

```env
DATABASE_URL=postgresql://user:password@host:5432/orbit
DIRECT_URL=postgresql://user:password@host:5432/orbit
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=dev
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=alerts@example.com
```

### 3. Run database migrations

```bash
cd server
npx prisma migrate deploy
cd ..
```

### 4. Start with Docker Compose

```bash
docker-compose up --build
```

This starts 7 containers: frontend (nginx), API server, producer, consumer, outbox worker, notification worker, and Redis.

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001 |
| Redis | localhost:6379 |

---

## Project Structure

```
Orbit/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/        # Zustand state management
│   ├── Dockerfile
│   └── nginx.conf
├── server/               # Node.js backend + workers
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── worker/
│   │   │   ├── producer.ts
│   │   │   ├── consumer.ts
│   │   │   ├── outbox.ts
│   │   │   └── notification.ts
│   │   └── lib/
│   ├── prisma/
│   └── Dockerfile
└── docker-compose.yml
```

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:5173` to Authorized JavaScript origins
4. Add your `CLIENT_URL` to Authorized redirect URIs
5. Copy the Client ID and Client Secret to your `.env` files
