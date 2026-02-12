# Movie Ticket Booking System (Kar's Movies)

A full-stack web app for browsing movies, viewing showtimes, and booking seats. It uses **React (Vite)** for the frontend, **Express.js** for the backend, **MongoDB Atlas** for data, **Clerk** for auth, and **Stripe** for payments.

**Live demo:** [movie-ticket-booking-system-erib.vercel.app](https://movie-ticket-booking-system-erib.vercel.app)

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** (v18 or newer) – [nodejs.org](https://nodejs.org)
- **Git**
- **MongoDB Atlas** account – [cloud.mongodb.com](https://cloud.mongodb.com)
- **Clerk** account (auth) – [clerk.com](https://clerk.com)
- (Optional) **Stripe** account (payments), **TMDB API key** (admin “Add Shows”), **Inngest** (background jobs)

---

## Step 1: Clone the repository

```bash
git clone https://github.com/karthikeya7746/Movie_ticket_booking_system.git
cd Movie_ticket_booking_system
```

---

## Step 2: Set up the backend (server)

### 2.1 Install dependencies

```bash
cd server
npm install
```

### 2.2 Create environment variables

Create a file named **`.env`** inside the `server` folder (same level as `server.js`). **Do not commit this file** – it contains secrets.

Add at least these variables (replace placeholders with your real values):

```env
# Database – required (get from Atlas: Connect → Drivers → copy connection string)
MONGODB_URI=<paste your Atlas connection string here, including /movie_booking before ?retryWrites=...>

# Auth (Clerk) – required for login/admin
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Admin “Add Shows” (TMDB)
TMDB_API_KEY=your_tmdb_api_key

# Optional: Emails (Nodemailer / Brevo)
SMTP_USER=...
SMTP_PASS=...
SENDER_EMAIL=...
```

**MongoDB Atlas:**

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → your project → **Database** → **Connect** → **Drivers**.
2. Copy the connection string and replace `<password>` with your DB user password.
3. Add the database name before the `?`: e.g. `...net/movie_booking?retryWrites=...`.

**Clerk:**

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) → your application.
2. Copy **Publishable key** and **Secret key** into `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.

### 2.3 Start the server

```bash
npm run server
```

You should see:

- `Database connected`
- `Server listening at http://localhost:3000`

Leave this terminal open. The API runs at **http://localhost:3000**.

### 2.4 (Optional) Add movies and showtimes

- **Movies only:** The app lists all movies from your MongoDB `movie_booking` database. If that database already has a `movies` collection with data, you don’t need to do anything else for the list.
- **Showtimes (bookable slots):**  
  - If you already have shows in the DB but with past dates, run:
    ```bash
    npm run update-shows
    ```
    This sets all existing shows to the next 5 days (4 times per day: 10:00, 13:00, 16:00, 19:00).  
  - Or run the full seed (replaces movies and shows with seed data):
    ```bash
    npm run seed
    ```

---

## Step 3: Set up the frontend (client)

Open a **new terminal** (keep the server running in the first one).

### 3.1 Install dependencies

```bash
cd client
npm install
```

(If you’re in `server`, go back to the project root first: `cd ..`, then `cd client`.)

### 3.2 Create environment variables

Create a file named **`.env`** inside the `client` folder.

Add at least:

```env
# Backend API URL – required
VITE_BASE_URL=http://localhost:3000

# Clerk – required for login
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
VITE_CURRENCY=USD
```

Use the **same** `VITE_CLERK_PUBLISHABLE_KEY` as in your Clerk dashboard (and as in the server’s Clerk keys).

### 3.3 Start the frontend

```bash
npm run dev
```

The app will run at **http://localhost:5173** (or the URL Vite prints). Open it in your browser.

---

## Step 4: Use the app

1. **Home** – Hero, “Now Showing” movies, trailers.
2. **Explore movies** (or `/movies`) – List of all movies from your database.
3. Click a movie → see showtimes (if you ran `update-shows` or `seed`).
4. Pick a date/time → **Seat layout** → select seats → **Book** → redirects to Stripe (if configured).
5. **My Bookings** – Requires sign-in (Clerk). Shows your bookings; “Pay Now” for unpaid ones.
6. **Admin** – Sign in with a Clerk user that has `role: admin` in private metadata to access the dashboard (add shows, list bookings, etc.).

---

## Project structure

```
Movie_ticket_booking_system/
├── client/                 # React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env                # VITE_BASE_URL, VITE_CLERK_PUBLISHABLE_KEY, etc.
│   └── package.json
├── server/                  # Express backend
│   ├── configs/            # DB, Nodemailer
│   ├── controllers/
│   ├── middleware/
│   ├── models/             # Movie, Show, Booking, User
│   ├── routes/
│   ├── inngest/            # Background jobs (emails, roll show dates)
│   ├── .env                # MONGODB_URI, Clerk, Stripe, TMDB, etc.
│   ├── server.js
│   ├── seed.js             # Seed movies + shows
│   └── update-show-dates.js # Set existing shows to upcoming dates
└── README.md               # This file
```

---

## Scripts reference

| Location | Command | Description |
|----------|---------|-------------|
| `server` | `npm run server` | Start API with nodemon (auto-restart on file change) |
| `server` | `npm start` | Start API with node |
| `server` | `npm run seed` | Seed DB with movies and shows (next 5 days) |
| `server` | `npm run update-shows` | Move existing shows to upcoming dates (next 5 days) |
| `client` | `npm run dev` | Start Vite dev server |
| `client` | `npm run build` | Production build for deployment |

---

## Deployment (Vercel)

**Full step-by-step from scratch:** see **[DEPLOY.md](./DEPLOY.md)** – prerequisites, backend deploy, frontend deploy, env vars, and checklist.

Short version:

1. **Deploy backend**  
   - Vercel → New Project → Import repo → **Root Directory: `server`**.  
   - Add all `server` env vars (e.g. `MONGODB_URI`, Clerk, Stripe, TMDB).  
   - Deploy and copy the backend URL.

2. **Deploy frontend**  
   - New Project → **Root Directory: `client`**.  
   - Set `VITE_BASE_URL` to your **backend URL** (e.g. `https://your-api.vercel.app`).  
   - Set `VITE_CLERK_PUBLISHABLE_KEY`.  
   - Deploy.

3. **Movies on the live site**  
   - The app loads movies from MongoDB Atlas. Ensure the deployed backend’s `MONGODB_URI` points to the same `movie_booking` database.  
   - For showtimes, run `npm run update-shows` or `npm run seed` once from your machine with `MONGODB_URI` set to that same Atlas DB.

4. **Stripe**  
   - In Stripe Dashboard, set the webhook URL to `https://your-backend-url.vercel.app/api/stripe`.

---

## Showtimes permanent (fix “disappearing after 5 days”)

**Why they disappear:** The app only shows showtimes in the **future**. Seed/update sets them to the next 5 days; after 5 days those dates are in the past, so no slots appear. **Movies** stay in the DB; it’s the **showtimes** that need to be rolled forward.

To keep **showtimes** (bookable slots) available forever, call the backend once per day so it rolls all shows to the next 5 days.

### 1. Add a secret on the backend

- **Vercel** → your **backend** project → **Settings** → **Environment Variables**.
- Add: **Key** `CRON_SECRET`, **Value** a long random string (e.g. generate one at [randomkeygen.com](https://randomkeygen.com)).
- **Redeploy** the backend.

### 2. Call the cron URL every day

Your backend exposes:

`https://YOUR-BACKEND-URL.vercel.app/api/cron/roll-show-dates?secret=YOUR_CRON_SECRET`

**Option A – Free cron service (e.g. cron-job.org)**  
1. Go to [cron-job.org](https://cron-job.org) (or similar) and create a free account.  
2. Create a new cron job:  
   - **URL:** `https://movie-ticket-booking-system-gules.vercel.app/api/cron/roll-show-dates?secret=YOUR_CRON_SECRET` (replace with your backend URL and real secret).  
   - **Schedule:** every day, e.g. 3:00 AM.  
3. Save. The site will call your backend daily; showtimes will stay in the “next 5 days” and never run out.

**Option B – Run manually**  
When showtimes are about to run out, open this URL in your browser (with your real secret):  
`https://YOUR-BACKEND-URL/api/cron/roll-show-dates?secret=YOUR_CRON_SECRET`

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| “No movies available” | Backend running? `VITE_BASE_URL` in client points to backend? `MONGODB_URI` points to DB that has `movie_booking` and a `movies` collection? |
| My Bookings blank / stuck | Sign in with Clerk. If still blank, check browser console and network tab for API errors. |
| No showtimes on movie page | Run `npm run update-shows` or `npm run seed` in `server` (with correct `MONGODB_URI`). |
| CORS errors | Backend `server.js` allows your frontend origin; add it to `CORS_ORIGIN` env if needed. |
| Stripe webhook fails | Use raw body for `/api/stripe` (already in code); set `STRIPE_WEBHOOK_SECRET` in server env. |

---

## License

Use this project for learning or portfolio. For production, add your own env vars and secrets; never commit `.env` files.
