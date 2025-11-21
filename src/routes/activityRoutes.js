import express from "express";
import { getActivity } from "../controllers/activityController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: visa senaste aktivitet
router.get("/", authenticateJWT, getActivity);

export default router;
