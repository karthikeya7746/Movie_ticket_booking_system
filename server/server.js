import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB, { ensureConnected } from "./configs/db.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";  // ✅ Correct imports
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

const app = express();
const port = process.env.PORT || 3000;

// Start DB connection without blocking (so Vercel serverless can load the app; ensureConnected() waits per-request)
connectDB().catch((err) => console.error("DB connect error:", err.message));

// Stripe Webhooks Route (must come before express.json)
app.use("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://movie-ticket-booking-system-sable.vercel.app",
  "https://movie-ticket-booking-system-erib.vercel.app",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").filter(Boolean) : []),
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(clerkMiddleware());  // ✅ Clerk auth middleware

// Routes
app.get("/", (req, res) => res.send("Server is Live!"));

// Ensure MongoDB is connected before other API handlers (avoids buffering timeouts on serverless)
app.use("/api", async (req, res, next) => {
  try {
    await ensureConnected();
    next();
  } catch (err) {
    console.error("DB ensureConnected error:", err.message);
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
});

// Example protected route
app.get("/api/protected", requireAuth(), (req, res) => {
  res.json({ message: "You are authenticated!", userId: req.auth.userId });
});

// Other routes
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

// Global error handler (catch any uncaught errors in route handlers)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Server error" });
});

// For Vercel serverless: export the app so the platform can invoke it
export default app;

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
