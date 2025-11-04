import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";

import {
  createFeedPost,
  getUserFeedPosts,
  getFullFeed,
  deleteFeedPost,
  getFriendFeed,
} from "../controllers/userFeedController.js";

const router = express.Router();

router.post("/feed-post", authenticateJWT, verifyCsrfToken, createFeedPost);
router.get("/friends-feed/", authenticateJWT, getFriendFeed);
router.get("/feed-post/feed/:userId", authenticateJWT, getFullFeed);
router.get("/feed-post/user/:userId", authenticateJWT, getUserFeedPosts);

router.delete(
  "/feed-post/:postId",
  authenticateJWT,
  verifyCsrfToken,
  deleteFeedPost
);

//feed

router.get("/friends-feed/", authenticateJWT, getFriendFeed);
router.get("/feed-post/feed/:userId", authenticateJWT, getFullFeed);
router.get("/feed-post/user/:userId", authenticateJWT, getUserFeedPosts);

export default router;
