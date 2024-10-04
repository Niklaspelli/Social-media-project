// routes/index.js or your main router file
import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  deleteUser,
  updateAvatar, // Import the updateAvatar function here
} from "../controllers/authController.js"; // Ensure the path is correct

import {
  createThread,
  getAllThreads,
  getThreadWithResponses,
  postResponseToThread,
} from "../controllers/forumController.js"; // Ensure this function is defined in your controller

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/settings/:id", deleteUser);
router.put("/users/avatar", authenticateJWT, updateAvatar); // Ensure this line is correct

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
