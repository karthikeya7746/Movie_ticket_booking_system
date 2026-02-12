# Deploy from scratch (step-by-step)

This guide walks you through deploying the Movie Ticket Booking System so others can use your website. You’ll deploy the **backend** and **frontend** separately on **Vercel**.

---

## Before you start

Have these ready:

| What | Where to get it |
|------|------------------|
| **GitHub repo** | Your code at `github.com/karthikeya7746/Movie_ticket_booking_system` |
| **MongoDB Atlas** | [cloud.mongodb.com](https://cloud.mongodb.com) – create a cluster and a database user; get the connection string |
| **Clerk** | [dashboard.clerk.com](https://dashboard.clerk.com) – create an application; get Publishable key and Secret key |
| **Vercel account** | [vercel.com](https://vercel.com) – sign up with GitHub |

Your Atlas connection string should look like (with your real values):

`mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/movie_booking?retryWrites=true&w=majority&appName=...`

Use the database name **`movie_booking`** (add it before `?` if not there).

---

## Part 1: Deploy the backend (API)

1. **Open Vercel**  
   Go to [vercel.com](https://vercel.com) and sign in (with GitHub if you can).

2. **New project**  
   Click **Add New** → **Project**.

3. **Import repo**  
   - If your GitHub is connected, choose **karthikeya7746/Movie_ticket_booking_system**.  
   - If not, connect GitHub first (Vercel will guide you), then select the repo.

4. **Set root to `server`**  
   - Find **Root Directory** (often under “Configure Project”).  
   - Click **Edit** and set it to **`server`** (only the server folder, not the whole repo).  
   - Click **Continue**.

5. **Add environment variables**  
   Before deploying, add the variables your server needs.  
   In the same screen (or **Settings** → **Environment Variables**), add:

   | Name | Value | Required? |
   |------|--------|-----------|
   | `MONGODB_URI` | Your full Atlas connection string (with `/movie_booking` before `?`) | Yes |
   | `CLERK_SECRET_KEY` | From Clerk Dashboard → API Keys | Yes |
   | `CLERK_PUBLISHABLE_KEY` | From Clerk Dashboard → API Keys | Yes (if server uses it) |
   | `STRIPE_SECRET_KEY` | From Stripe Dashboard (if you use payments) | Optional |
   | `STRIPE_WEBHOOK_SECRET` | From Stripe → Webhooks (add after first deploy) | Optional |
   | `TMDB_API_KEY` | From themoviedb.org (if you use admin “Add Shows”) | Optional |
   | `CORS_ORIGIN` | Your frontend URL (e.g. `https://your-app.vercel.app`) | Optional |

   Add each one: **Name** = left column, **Value** = your real value.  
   Apply to **Production** (and Preview if you want).

6. **Deploy**  
   Click **Deploy**. Wait until the build finishes.

7. **Copy the backend URL**  
   After success, you’ll see a URL like `https://movie-ticket-booking-api-xxx.vercel.app`.  
   **Copy this** – you need it for the frontend.

8. **Test the backend**  
   Open in a browser: `https://YOUR-BACKEND-URL.vercel.app`  
   You should see: `Server is Live!`

---

## Part 2: Deploy the frontend (website)

1. **New project again**  
   In Vercel, click **Add New** → **Project**.

2. **Same repo, different root**  
   - Import **karthikeya7746/Movie_ticket_booking_system** again.  
   - This time set **Root Directory** to **`client`** (not `server`).  
   - Click **Continue**.

3. **Add environment variables**  
   Add these for the **client**:

   | Name | Value | Required? |
   |------|--------|-----------|
   | `VITE_BASE_URL` | **Your backend URL** from Part 1 (e.g. `https://movie-ticket-booking-api-xxx.vercel.app`) | Yes |
   | `VITE_CLERK_PUBLISHABLE_KEY` | Same Publishable key from Clerk (as in backend) | Yes |
   | `VITE_TMDB_IMAGE_BASE_URL` | `https://image.tmdb.org/t/p/w500` (if you use TMDB images) | Optional |
   | `VITE_CURRENCY` | `USD` (or your currency) | Optional |

   **Important:** `VITE_BASE_URL` must be the **exact** backend URL from Part 1 (no trailing slash).  
   Apply to **Production** (and Preview if you want).

4. **Deploy**  
   Click **Deploy**. Wait until the build finishes.

5. **Copy the frontend URL**  
   You’ll get a URL like `https://movie-ticket-booking-system-xxx.vercel.app`.  
   **This is your live website** – share this with users.

6. **Test the website**  
   Open the frontend URL. You should see the home page.  
   - If you see **“No movies available”** on Explore movies:  
     - Check that the backend env has the correct `MONGODB_URI`.  
     - Ensure your Atlas `movie_booking` database has a **movies** collection with at least one document.  
     - Redeploy the frontend after changing env vars (Vite bakes them at build time).

---

## Part 3: Make sure visitors see movies and showtimes

### Movies list

- The app reads movies from MongoDB: database **`movie_booking`**, collection **`movies`**.
- The backend’s `MONGODB_URI` must point to that database.
- If the collection is empty, the site will show “No movies available”. Add movies via:
  - **Admin** (if you use “Add Shows” and TMDB), or  
  - **Seed** (see below).

### Showtimes (bookable slots)

- Showtimes come from the **`shows`** collection (with `showDateTime` in the future).
- **Option A – You already have shows in Atlas but with past dates:**  
  On your **local** machine, in the project folder:
  ```bash
  cd server
  npm install
  ```
  Create `server/.env` with **the same** `MONGODB_URI` as on Vercel (your production DB). Then:
  ```bash
  npm run update-shows
  ```
  This updates all shows to the next 5 days. Your **deployed** backend will then serve them.

- **Option B – Empty or no shows:**  
  With the same `server/.env` and `MONGODB_URI`:
  ```bash
  npm run seed
  ```
  This adds seed movies and shows. Again, the deployed backend uses the same DB, so the live site will show them.

---

## Keep showtimes permanent (no disappearing after 5 days)

**Why they disappear:** The app only shows showtimes whose date/time is in the **future**. Your seed/update sets them to the “next 5 days”. After 5 days, those dates are in the past, so no showtimes appear (movies stay; only bookable slots vanish).

**Fix – run a daily cron** that “rolls” show dates to the next 5 days so they never run out:

1. **Backend env on Vercel**  
   In your **backend** project → **Settings** → **Environment Variables** add:
   - **Name:** `CRON_SECRET`
   - **Value:** a long random string (e.g. generate one at [randomkeygen.com](https://randomkeygen.com)). Keep this secret.  
   Redeploy the backend.

2. **Call the cron endpoint every day**  
   Use a free cron service (e.g. [cron-job.org](https://cron-job.org)) so it hits your backend once per day:
   - **URL:** `https://YOUR-BACKEND-URL.vercel.app/api/cron/roll-show-dates?secret=YOUR_CRON_SECRET`  
     (replace `YOUR-BACKEND-URL` and `YOUR_CRON_SECRET` with your real values).
   - **Schedule:** daily (e.g. every day at 00:05 or 01:00).
   - Save the cron job.

After this, showtimes will be moved to the next 5 days every day, so they stay visible and bookable. **Movies** are already stored permanently in the `movies` collection and do not expire.

---

## Part 4: Optional – Stripe and Clerk for production

### Stripe (payments)

1. In [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks** → **Add endpoint**.
2. **Endpoint URL:** `https://YOUR-BACKEND-URL.vercel.app/api/stripe`  
   (use the **exact** backend URL from Part 1).
3. Select events (e.g. `payment_intent.succeeded`) and create.
4. Copy the **Signing secret** (`whsec_...`).
5. In Vercel → **backend project** → **Settings** → **Environment Variables** → add or update `STRIPE_WEBHOOK_SECRET` with that value.
6. **Redeploy** the backend.

### Clerk (sign-in on live site)

1. In [Clerk Dashboard](https://dashboard.clerk.com) → your application → **Configure** → **Paths** / **Domains** (or **Allowed origins**).
2. Add your **frontend** URL, e.g. `https://movie-ticket-booking-system-xxx.vercel.app`, so sign-in and callbacks work in production.

---

## Troubleshooting

### "Operation \`movies.find()\` buffering timed out" (or \`shows.find()\`)

This means the backend could not reach MongoDB in time. Fix:

1. **Backend on Vercel**  
   In the **backend** project → **Settings** → **Environment Variables**, ensure **`MONGODB_URI`** is set to your full Atlas connection string (with `/movie_booking` before `?`). Redeploy the backend after changing it.

2. **MongoDB Atlas Network Access**  
   Atlas must allow the backend to connect. In [cloud.mongodb.com](https://cloud.mongodb.com) → your project → **Network Access** → **Add IP Address** → choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel’s servers can connect. Save.

3. **Frontend: point to the backend**  
   In the **frontend** Vercel project → **Settings** → **Environment Variables**, set **`VITE_BASE_URL`** to your **backend** URL (e.g. `https://movie-ticket-booking-system-gules.vercel.app`), with **no trailing slash**. Redeploy the frontend (Vite bakes env at build time).

4. **CORS**  
   The backend already allows common Vercel frontend URLs. If you use a different frontend URL, add it via the backend env var **`CORS_ORIGIN`** (or add the URL in the backend’s `allowedOrigins` in code) and redeploy the backend.

---

## Part 5: Optional – Backend CORS

If your frontend URL is **different** from the one already allowed in code (e.g. a new Vercel URL), add it in Vercel for the **backend** project:

- **Name:** `CORS_ORIGIN`  
- **Value:** Your frontend URL (e.g. `https://movie-ticket-booking-system-xxx.vercel.app`)

Then redeploy the backend.

---

## Checklist (deploy from scratch)

- [ ] MongoDB Atlas: cluster + DB user; connection string with `/movie_booking`; optionally seed or update-shows.
- [ ] Clerk: application created; Publishable and Secret keys copied.
- [ ] Vercel backend: repo imported, root = `server`, env vars set, deploy done, URL copied.
- [ ] Vercel frontend: repo imported, root = `client`, `VITE_BASE_URL` = backend URL, `VITE_CLERK_PUBLISHABLE_KEY` set, deploy done.
- [ ] Live test: open frontend URL → see home → Explore movies shows movies (if DB has data).
- [ ] (Optional) Stripe webhook and Clerk domain/origin for production.

---

## Summary

| Step | What you do |
|------|-----------------|
| 1 | Deploy **server** on Vercel (root `server`), add env vars, copy backend URL. |
| 2 | Deploy **client** on Vercel (root `client`), set `VITE_BASE_URL` = backend URL, add Clerk key, deploy. |
| 3 | Ensure Atlas `movie_booking` has movies (and optionally run `update-shows` or `seed` locally with same `MONGODB_URI`). |
| 4 | Share the **frontend** URL; that’s your live site. |

Your live site URL is the **frontend** Vercel URL (e.g. `https://movie-ticket-booking-system-xxx.vercel.app`).
