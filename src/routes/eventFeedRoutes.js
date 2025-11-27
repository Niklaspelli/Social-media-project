import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";

import {
  getEventFeedController,
  createEventFeedController,
  deleteEventFeedController,
} from "../controllers/eventcontroller/event-feed.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/:eventId/feed", authenticateJWT, getEventFeedController);
router.post(
  "/:eventId/feed",
  authenticateJWT,
  verifyCsrfToken,
  createEventFeedController
);
router.delete(
  "/feed/:postId",
  authenticateJWT,
  verifyCsrfToken,
  deleteEventFeedController
);

export default router;
