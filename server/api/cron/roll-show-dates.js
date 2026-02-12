/**
 * Standalone Vercel serverless function for rolling show dates.
 * URL: /api/cron/roll-show-dates?secret=YOUR_CRON_SECRET
 */
import mongoose from "mongoose";
import Show from "../../models/Show.js";

const TIMINGS = ["10:00", "13:00", "16:00", "19:00"];
const SLOTS_PER_DAY = TIMINGS.length;
const DAYS_AHEAD = 5;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const secret = req.query?.secret || req.headers["x-cron-secret"];
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    }

    const shows = await Show.find({}).sort({ movie: 1, showDateTime: 1 });
    if (shows.length === 0) {
      return res.json({ success: true, updated: 0, message: "No shows in DB." });
    }

    const today = new Date();
    const byMovie = {};
    for (const show of shows) {
      const id = show.movie.toString();
      if (!byMovie[id]) byMovie[id] = [];
      byMovie[id].push(show);
    }

    let updated = 0;
    for (const movieId of Object.keys(byMovie)) {
      const movieShows = byMovie[movieId];
      for (let i = 0; i < movieShows.length; i++) {
        const dayOffset = Math.floor(i / SLOTS_PER_DAY) % DAYS_AHEAD;
        const timeIndex = i % SLOTS_PER_DAY;
        const [hours, minutes] = TIMINGS[timeIndex].split(":").map(Number);
        const newDate = new Date(today);
        newDate.setDate(today.getDate() + dayOffset);
        newDate.setHours(hours, minutes, 0, 0);
        await Show.findByIdAndUpdate(movieShows[i]._id, { showDateTime: newDate });
        updated++;
      }
    }

    res.json({ success: true, updated, message: `Updated ${updated} show(s) to next ${DAYS_AHEAD} days.` });
  } catch (err) {
    console.error("Cron roll-show-dates error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
