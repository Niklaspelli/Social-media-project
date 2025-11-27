import express from "express";
import { getActivityController } from "../controllers/forumcontroller/activity.controller.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: visa senaste aktivitet
router.get("/", authenticateJWT, getActivityController);

export default router;
