import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { getEventOverviewController } from "../controllers/eventcontroller/event-overview.controller.js";

const router = express.Router();

router.get("/:eventId/overview", authenticateJWT, getEventOverviewController);

export default router;
