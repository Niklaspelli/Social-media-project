import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import {
  createEventFeedPost,
  getEventFeedPosts,
  deleteEventFeedPost,
} from "../controllers/eventFeedController.js";

const router = express.Router();

router.post(
  "/events/:eventId/feed",
  authenticateJWT,
  verifyCsrfToken,
  createEventFeedPost
);

router.get("/events/:eventId/feed", authenticateJWT, getEventFeedPosts);
router.delete(
  "/event-feed-post/:postId",
  authenticateJWT,
  verifyCsrfToken,
  deleteEventFeedPost
);

export default router;
