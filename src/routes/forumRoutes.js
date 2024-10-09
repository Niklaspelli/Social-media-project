import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  deleteUser,
  updateAvatar,
} from "../controllers/authController.js";

import {
  createThread,
  getAllThreads,
  getThreadWithResponses,
  postResponseToThread,
  deleteResponse,
} from "../controllers/forumController.js";

import {
  createOrUpdateUserProfile,
  updateUserProfile,
  getUserProfile,
} from "../controllers/userProfileController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/users/:userId", authenticateJWT, deleteUser); // Changed to :userId for consistency
router.put("/users/avatar", authenticateJWT, updateAvatar);

// User Profile routes
router.get("/users/:userId", authenticateJWT, getUserProfile); // Consistent parameter name
router.post("/users", authenticateJWT, createOrUpdateUserProfile);
router.put("/users/:userId", authenticateJWT, updateUserProfile); // Changed to :userId

// Forum routes

router.post("/threads", authenticateJWT, createThread);
router.get("/threads", getAllThreads);
router.get("/threads/:threadId", getThreadWithResponses);
router.post(
  "/threads/:threadId/responses",
  authenticateJWT,
  postResponseToThread
);

router.delete("/responses/:responseId", authenticateJWT, deleteResponse);
export default router;
