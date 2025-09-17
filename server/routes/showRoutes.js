import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShows } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

// Admin routes
showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies);
showRouter.post('/add', protectAdmin, addShow);

// Public routes
showRouter.get("/", getShows);  // ✅ Add root for all shows
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getShow);

export default showRouter;
