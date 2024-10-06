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
router.delete("/settings/:id", deleteUser);
router.put("/users/avatar", authenticateJWT, updateAvatar);

// User Profile routes
// Route for getting user profile by profileId
router.get("/users/:userId", authenticateJWT, getUserProfile);

// Route for creating or updating user profile
router.post("/users", authenticateJWT, createOrUpdateUserProfile); // Ensure this matches your POST request

// Route for updating user profile by profileId
router.put("/users/:id", authenticateJWT, updateUserProfile);

// Create a new thread
router.post("/threads", authenticateJWT, createThread);

// Get all threads
router.get("/threads", getAllThreads);

// Get a specific thread with responses
router.get("/threads/:threadId", getThreadWithResponses);

// Post a response to a specific thread
router.post(
  "/threads/:threadId/responses",
  authenticateJWT,
  postResponseToThread
);

export default router;
