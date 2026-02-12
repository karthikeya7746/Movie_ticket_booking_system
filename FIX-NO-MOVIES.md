# Step-by-step: Fix "No movies available" on your live site

Follow these steps in order. After each part, you can test your site: **https://movie-ticket-booking-system-erib.vercel.app**

---

## Part 1: Allow your frontend in the backend (CORS)

Your frontend URL is `https://movie-ticket-booking-system-erib.vercel.app`. The backend must allow this URL or the browser will block the API and you’ll see no movies.

### Option A – Add env var on Vercel (no code push)

1. Go to **[vercel.com](https://vercel.com)** and sign in.
2. Open the **backend** project (the one that shows **"Server is Live!"** when you open its URL – e.g. **movie-ticket-booking-system-gules**).
3. Click **Settings** (top menu).
4. In the left sidebar, click **Environment Variables**.
5. Under **Key**, type: **`CORS_ORIGIN`**
6. Under **Value**, type: **`https://movie-ticket-booking-system-erib.vercel.app`**
7. Choose **Production** (and **Preview** if you use it), then click **Save**.
8. Go to the **Deployments** tab.
9. Open the **⋮** menu on the latest deployment → **Redeploy** → **Redeploy** again to confirm.
10. Wait until the new deployment is **Ready**.

---

## Part 2: Make sure the frontend calls your backend

1. On Vercel, open the **frontend** project (the one that shows **"KAR'S MOVIES"** – e.g. **movie-ticket-booking-system-erib**).
2. Click **Settings** → **Environment Variables**.
3. Find **`VITE_BASE_URL`**.
   - If it’s missing, add it:
     - **Key:** `VITE_BASE_URL`
     - **Value:** `https://movie-ticket-booking-system-gules.vercel.app`  
       (use your real backend URL – the one that shows "Server is Live!").
   - If it exists, make sure the value is **exactly** your backend URL (no trailing slash, no typo).
4. If you added or changed `VITE_BASE_URL`, you **must** redeploy the frontend:
   - Go to **Deployments** → **⋮** on latest deployment → **Redeploy** → **Redeploy**.
   - Wait until **Ready**.

---

## Part 3: Make sure the backend has MongoDB and data

1. On Vercel, open the **backend** project again.
2. Go to **Settings** → **Environment Variables**.
3. Find **`MONGODB_URI`**.
   - It must point to your **MongoDB Atlas** cluster.
   - The path must include the database name: **`/movie_booking`** before `?retryWrites=...`.  
     Example: `...mongodb.net/movie_booking?retryWrites=...`
   - If it’s wrong or missing, add/edit it with your real Atlas connection string, then **Redeploy** the backend (Deployments → ⋮ → Redeploy).

4. **Check that the database has movies:**
   - Go to [cloud.mongodb.com](https://cloud.mongodb.com) → your project → **Database** → **Browse Collections**.
   - Open the **`movie_booking`** database.
   - Open the **`movies`** collection.
   - If it’s **empty**, you need to add data once from your computer:
     - In your project folder, open `server/.env` and set **`MONGODB_URI`** to the **same** connection string as on Vercel (same Atlas, same `movie_booking` DB).
     - In a terminal:
       ```bash
       cd server
       npm run update-shows
       ```
       (or `npm run seed` if you prefer to reseed everything.)
     - After it finishes, refresh your live site – movies should appear.

---

## Part 4: Test your site

1. Open **https://movie-ticket-booking-system-erib.vercel.app** in your browser.
2. Go to **Explore movies** (or the Movies page).
3. You should see your list of movies.

If you still see **"No movies available"**:

- Press **F12** → open **Console**. Note any red errors.
- In the same dev tools, open **Network**. Refresh the page. Find the request to your backend (e.g. `.../api/show/all` or similar). Check if it’s **red** (failed) and what the status/response is.
- Confirm again:
  - Backend env: `CORS_ORIGIN` = `https://movie-ticket-booking-system-erib.vercel.app` and backend was **redeployed**.
  - Frontend env: `VITE_BASE_URL` = your backend URL and frontend was **redeployed**.
  - Atlas: `movie_booking.movies` has at least one document.

---

## Quick checklist

- [ ] Backend: `CORS_ORIGIN` = `https://movie-ticket-booking-system-erib.vercel.app` → **Redeploy backend**
- [ ] Frontend: `VITE_BASE_URL` = `https://movie-ticket-booking-system-gules.vercel.app` (your backend URL) → **Redeploy frontend**
- [ ] Backend: `MONGODB_URI` set and includes `/movie_booking`
- [ ] Atlas: `movie_booking.movies` has data (if not, run `npm run update-shows` or `npm run seed` from your machine)
- [ ] Test: open live site → Explore movies → movies visible
