# Doctor Patient Portal

A full-stack web app for connecting patients with doctors and clinics. Doctors can sign up, create and manage a clinic, handle appointment requests, and manage patient queues. Patients can search clinics, request appointments, and track their appointments.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- React Bootstrap
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT authentication with HTTP-only cookies

## Features

- Patient and doctor signup/login
- Role-based protected routes
- Doctor clinic creation and management
- Doctor dashboard with appointment requests and queue overview
- Patient clinic search
- Appointment request, accept, decline, and queue flow
- Clinic open/close status
- User profile management

## Project Structure

```text
.
├── public/              # Static frontend assets
├── server/              # Express API, routes, models, middleware
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js
├── src/                 # React frontend
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── Dockerfile
├── docker-compose.yml
└── vite.config.ts
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start MongoDB

The server uses this default database URL:

```text
mongodb://localhost:27017/doctor-patient-portal
```

Make sure MongoDB is running locally, or provide your own connection string with `MONGODB_URI`.

### 3. Run The App

Start frontend and backend together:

```bash
npm run dev:full
```

Or run them separately:

```bash
npm run dev
npm run server
```

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000/api
```

## Environment Variables

Copy `.env.example` to `.env` and edit as needed. On startup, the Express server loads `.env` from the project root (via `server/loadEnv.js`). Vite also reads `VITE_*` variables from the same file when you run the frontend.

```env
MONGODB_URI=mongodb://localhost:27017/doctor-patient-portal
JWT_SECRET=your_jwt_secret_key
PORT=5000
COOKIE_SECURE=false
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

`CLIENT_ORIGIN` must match the URL where you open the React app (CORS and Socket.IO). Set `COOKIE_SECURE=true` when the site is served only over HTTPS.

### Docker

Requires Docker Desktop or Docker Engine with Compose.

```bash
docker compose up --build -d
```

Then open **http://localhost:8080**. The UI and API share one origin (`/api`).

```bash
npm run docker:up    # docker compose up --build -d
npm run docker:down  # docker compose down
npm run docker:logs  # docker compose logs -f app
```

If you use a different host or port in the browser, set `CLIENT_ORIGIN` to match (for example `http://127.0.0.1:8080`). Set a strong `JWT_SECRET` in the environment before deploying anywhere public.

## Available Scripts

```bash
npm run dev       # Start the Vite frontend
npm run server    # Start the Express backend
npm run dev:full  # Start frontend and backend together
npm run start     # Production: run Node server (expects dist/ + MongoDB)
npm run build     # Create a production frontend build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
npm run docker:up    # Docker: compose up --build -d
npm run docker:down  # Docker: compose down
npm run docker:logs  # Docker: follow app container logs
```

## Main Routes

Frontend routes:

- `/` - Home page
- `/login` - Login
- `/signup` - Signup
- `/doctor` - Doctor dashboard
- `/doctor/create-clinic` - Doctor clinic setup
- `/doctor/clinic` - Clinic management
- `/doctor/appointments` - Doctor appointments
- `/patient` - Patient dashboard
- `/patient/search` - Search clinics
- `/patient/appointments` - Patient appointments

API route groups:

- `/api/auth`
- `/api/users`
- `/api/clinics`
- `/api/appointments`
- `/api/queue`
- `/api/ratings`

## Notes

- Doctors must create a clinic before using the doctor dashboard.
- Authentication uses cookies, so frontend requests include `withCredentials: true`.
- The backend CORS origin is configured for `http://localhost:5173`.
