/**
 * Makes all existing shows "upcoming" by setting their showDateTime
 * to the next 14 days (4 times per day: 10:00, 13:00, 16:00, 19:00).
 * Run from server folder: node update-show-dates.js
 */
import mongoose from "mongoose";
import "dotenv/config";
import Show from "./models/Show.js";

const timings = ["10:00", "13:00", "16:00", "19:00"];

const updateShowDates = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected...");

    const shows = await Show.find({}).sort({ movie: 1, showDateTime: 1 });
    if (shows.length === 0) {
      console.log("No shows found. Run seed first: npm run seed");
      process.exit(1);
    }

    const today = new Date();
    const slotsPerDay = timings.length; // 4
    const days = 14;

    // Group shows by movie
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
        const dayOffset = Math.floor(i / slotsPerDay) % days;
        const timeIndex = i % slotsPerDay;
        const [hours, minutes] = timings[timeIndex].split(":").map(Number);

        const newDate = new Date(today);
        newDate.setDate(today.getDate() + dayOffset);
        newDate.setHours(hours, minutes, 0, 0);

        await Show.findByIdAndUpdate(movieShows[i]._id, { showDateTime: newDate });
        updated++;
      }
    }

    console.log(`✅ Updated ${updated} show(s) to upcoming dates (next ${days} days).`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  }
};

updateShowDates();
