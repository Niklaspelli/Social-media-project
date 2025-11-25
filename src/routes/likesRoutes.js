import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import {
  toggleLikeController,
  getLikeCountController,
} from "../controllers/forumcontroller/likes.controller.js";

const router = express.Router();

// Toggle like/unlike
router.post(
  "/:responseId/like",
  authenticateJWT,
  verifyCsrfToken,
  toggleLikeController
);

// Get total likes
router.get("/:responseId/like-count", getLikeCountController);

export default router;
