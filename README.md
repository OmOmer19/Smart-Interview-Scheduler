# 📅 Smart Interview Scheduler

![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green)
![Express](https://img.shields.io/badge/Express-5.0.0-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-brightgreen)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0.0-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0.0-blueviolet)
![Socket.io](https://img.shields.io/badge/Socket.io-4.0.0-black)
![License](https://img.shields.io/badge/License-MIT-yellow)

A production-grade interview scheduling system that automates the entire interview lifecycle — from availability setup to booking, Google Calendar events, Meet links, and email notifications.

---

## 🌟 Features

### Core Features
- 🔐 **Google OAuth 2.0** — Interviewers sign in with Google — no passwords
- 📅 **Auto Slot Generation** — Set weekly availability once, slots auto-generate for 30 days
- 🎯 **Atomic Slot Booking** — Race condition safe — no double booking ever
- 📆 **Google Calendar Integration** — Auto creates calendar events with Google Meet links
- 📧 **Automated Emails** — Confirmation, cancellation and reschedule emails via Gmail API
- 🔔 **Real-time Notifications** — Instant Socket.io notifications for new bookings and cancellations
- 🔗 **Tokenized Candidate Actions** — Cancel or reschedule via email links — no login required
- 📊 **Interviewer Dashboard** — Stats, upcoming bookings, past bookings

### Candidate Features
- 🌐 **Public Booking Flow** — No account required
- 🔍 **Interviewer Search** — Browse and search interviewers by name
- 📋 **Slot Browser** — View all available slots and select a time
- ✅ **Instant Confirmation** — Booking success screen + confirmation email

### Background Jobs
- ⚙️ **Daily Slot Generation** — Cron job runs at midnight to keep slots 30 days ahead
- ⏰ **30-min Reminders** — Cron job notifies interviewers before upcoming interviews

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io
- Google Calendar API + Gmail API
- Google OAuth 2.0 + JWT
- node-cron

### Frontend
- React + Vite
- Tailwind CSS
- Socket.io-client
- Axios
- React Router DOM
- React Hot Toast

---

## 📁 Project Structure

```
smart-interview-scheduler/
├── backend/
│   ├── config/               # DB, OAuth, Socket.io config
│   ├── controllers/          # Route handler logic
│   ├── jobs/                 # Cron jobs
│   ├── middleware/           # Auth middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routers
│   ├── services/             # Google Calendar, Gmail, Notification services
│   ├── server.js             # Entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service calls
│   │   └── utils/            # Axios instance
│   ├── index.html
│   └── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Cloud Console project

### 1. Clone the repository

```bash
git clone https://github.com/OmOmer19/Smart-Interview-Scheduler.git
cd Smart-Interview-Scheduler
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env` values — see Environment Variables section below.

```bash
node server.js
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in your `.env` values.

```bash
npm run dev
```

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `PORT` | Server port (default 3000) |
| `FRONTEND_URL` | Frontend URL for CORS and email links |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL |

### Frontend `.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services** → **Enable APIs**
4. Enable **Google Calendar API** and **Gmail API**
5. Go to **APIs & Services** → **Credentials**
6. Create **OAuth 2.0 Client ID** (Web application)
7. Add **authorized redirect URI**:
8. Copy Client ID and Client Secret to your `.env`
9. Go to **OAuth consent screen** → add your Gmail as a test user

---

## 📋 Booking Flow

1. Interviewer logs in with Google OAuth
2. Interviewer creates availability rules (days + time window + duration)
3. System auto-generates bookable slots for next 30 days
4. Candidate visits `/book` and searches for an interviewer
5. Candidate selects a slot and fills in their details
6. System atomically locks the slot — no double booking possible
7. Google Calendar event created with Meet link
8. Confirmation emails sent to both candidate and interviewer
9. Interviewer receives real-time Socket.io notification
10. Candidate can cancel or reschedule via links in their email

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/auth/google` | Initiate Google OAuth | Public |
| GET | `/api/auth/google/callback` | OAuth callback | Public |
| GET | `/api/auth/interviewers` | Get all interviewers | Public |

### Availability
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/availability` | Create availability rule | Protected |

### Slots
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/slots/:interviewerId` | Get available slots | Public |

### Bookings
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/bookings` | Book a slot | Public |
| GET | `/api/bookings/interviewer` | Get interviewer bookings | Protected |
| GET | `/api/bookings/candidate/:email` | Get candidate bookings | Public |
| PUT | `/api/bookings/cancel/:bookingId` | Cancel booking | Public |
| PUT | `/api/bookings/reschedule/:bookingId` | Reschedule booking | Public |
| GET | `/api/bookings/:bookingId` | Get booking by ID | Public |

### Notifications
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/notifications` | Get all notifications | Protected |
| PATCH | `/api/notifications/:id/read` | Mark as read | Protected |
| PATCH | `/api/notifications/read-all` | Mark all as read | Protected |

### Dashboard
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard/stats` | Get stats | Protected |
| GET | `/api/dashboard/upcoming` | Upcoming bookings | Protected |
| GET | `/api/dashboard/past` | Past bookings | Protected |

---

## 📸 Pages

- `/` — Login page with Google OAuth + dashboard preview
- `/dashboard` — Interviewer dashboard with stats and bookings
- `/availability` — Manage availability rules and view slots
- `/notification` — Real-time notifications with unread badge
- `/book` — Public interviewer directory for candidates
- `/book/:interviewerId` — Slot browser and booking form
- `/cancel/:bookingId` — Cancel booking via email link
- `/reschedule/:bookingId` — Reschedule booking via email link

---

## ⚠️ Important Notes

- App is in **Google OAuth testing mode** — interviewers must be added as test users in Google Cloud Console
- Access tokens expire after **1 hour** — auto refreshed via refresh token
- Refresh tokens expire after **7 days** in testing mode — interviewer must re-login
- Publishing the app on Google Cloud Console removes the 7-day limit

---

## 👨‍💻 Developer

Made by **Om Omer**