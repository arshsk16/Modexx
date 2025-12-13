# Medi-Connect

Modern full‑stack platform for hospital discovery, patient onboarding, and appointment management. The frontend is a React app (Create React App + Tailwind), and the backend is a Node/Express API backed by MongoDB with Google OAuth, JWT auth, email/SMS notifications, and Prometheus metrics.

demo link frontend:
https://modexx-rho.vercel.app/

## Overview
- Patient registration with multi‑step forms and profile management
- Hospital listing, detail pages, bookings, and appointments
- Google sign‑in and token‑based authentication
- Charts, analytics, and interactive UI elements
- Email and SMS notifications for confirmations
- Health check and `/metrics` endpoint for monitoring

## Tech Stack
- Frontend: `react`, `react-router-dom`, `tailwindcss`, `chart.js`, `leaflet`, `recoil`, `axios`
- Backend: `express`, `mongoose`, `passport-google-oauth20`, `jsonwebtoken`, `zod`, `nodemailer`, `twilio`, `prom-client`
- Database: MongoDB (Atlas or local)
- Tooling: ESLint, Prettier, Husky + lint-staged

## Project Structure
```
.
├─ client/            # React app (CRA) + Tailwind
│  ├─ public/
│  └─ src/
│     ├─ pages/, components/, styles/, store/
│     └─ data/databaseUrls.js   # Base API URL selector (dev vs prod)
├─ server/            # Express API + MongoDB
│  ├─ config/, models/, controllers/, routes/, utils/, validators/
│  ├─ app.js          # App and middleware setup
│  └─ index.js        # DB connect + server start
└─ package.json       # Repo‑level tooling (ESLint/Prettier/Husky)
```

## Prerequisites
- Node.js 18+
- MongoDB connection string (Atlas or local)
- Google OAuth credentials (OAuth 2.0 Client ID/Secret)
- SMTP credentials (for email)
- Twilio credentials (for SMS)

## Setup
1) Install repo‑level dev tools (optional):
```
npm install
```

2) Backend:
```
cd server
npm install
npm run dev
```
Create `server/.env` with:
```
# Server
PORT=5000

# Database (either variable works)
MONGODB_URI=<your_mongodb_connection_string>
# or
PASSDB=<your_mongodb_connection_string>

# Sessions and JWT
SESSION_SECRET=<random_long_string>
JWT_SECRET=<random_long_string>

# Google OAuth
GOOGLE_CLIENT_ID=<client_id>
GOOGLE_CLIENT_SECRET=<client_secret>
# Client origin for postMessage after Google sign‑in
CLIENT_URL=http://localhost:3000
# Optional alternative
FRONTEND_URL=http://localhost:3000

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_EMAIL=<gmail_address>
SMTP_PASSWORD=<app_password_or_smtp_password>

# Twilio
TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_NUMBER=<from_number>
```

3) Frontend:
```
cd client
npm install
npm start
```
The frontend auto‑selects API base URL:
- `http://localhost:5000` when running locally
- `https://medi-connect-f671.onrender.com` in production
See `client/src/data/databaseUrls.js`.

## Development Notes
- CORS allows common local dev origins (`http://localhost:3000`, `3001`, `8080`) and deployed origins. Adjust `server/utils/cors/corsConfig.js` if needed.
- Google sign‑in posts a JWT to the client via `window.postMessage` using `CLIENT_URL`. Ensure your client domain matches.
- Health check: `GET /ping` returns `{ message: "pong" }`
- Metrics: `GET /metrics` exposes Prometheus metrics

## Key API Routes
- Auth: `POST /auth/login`, `POST /auth/register`, `GET /auth/profile`
- Hospitals: `GET /hospitalapi`, `GET /hospitalapi/_id`, `POST /hospitalapi/hospitals/_id/book`
- Appointments: `GET /hospitalapi/appointments`
- Google OAuth: `GET /auth/google`, callback at `/auth/google/callback`

## Linting & Formatting
- Repo:
  - Husky pre‑commit hooks are installed via `npm run prepare`
  - `lint-staged` runs Prettier/ESLint on staged files
- Server:
  - `npm run format` to format
  - `npm run format-check` to verify

## Security
- Do not commit `.env` files or secrets
- Use app passwords for SMTP if using Gmail
- Keep JWT and session secrets strong and private

## Deployment
- Frontend can be deployed on Netlify/Vercel; ensure `databaseUrls.js` points to your backend URL.
- Backend can be deployed on Render/Heroku; set all environment variables and open required ports.

## License
ISC (see package.json)


Frontend Deployment (Vercel / Netlify)

