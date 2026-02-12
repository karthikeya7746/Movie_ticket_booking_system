import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment");
  }
  try {
    mongoose.connection.on("connected", () => console.log("Database connected"));
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

/** Wait for MongoDB to be connected and reachable (avoids buffering timeouts). */
export const ensureConnected = async () => {
  const waitForConnect = () =>
    new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) return resolve();
      const t = setTimeout(() => reject(new Error("Database connection timeout")), 20000);
      mongoose.connection.once("connected", () => {
        clearTimeout(t);
        resolve();
      });
      mongoose.connection.once("error", (err) => {
        clearTimeout(t);
        reject(err);
      });
    });

  await waitForConnect();
  // Optionally verify with ping (don't block if ping fails - connection may still work)
  try {
    const db = mongoose.connection.db;
    if (db) await db.admin().command({ ping: 1 });
  } catch (_) {
    // Continue anyway; query may still succeed
  }
};

export default connectDB;