import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
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

// Connect DB
await connectDB();

// Stripe Webhooks Route (must come before express.json)
app.use("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://movie-ticket-booking-system-sable.vercel.app",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").filter(Boolean) : []),
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(clerkMiddleware());  // ✅ Clerk auth middleware

// Routes
app.get("/", (req, res) => res.send("Server is Live!"));

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

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
