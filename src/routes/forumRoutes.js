import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import { generateCsrfToken } from "../domain/auth_handler.js"; // Make sure you have this import

import {
  registerUser,
  loginUser,
  getCsrfToken,
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

router.get("/csrf-token", getCsrfToken); // ⬅️ Add this line

// Optional test route
router.get("/test", (req, res) => {
  res.send("Forum routes are working!");
});
console.log("forumRoutes.js loaded");

// 🛡️ Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/users/:userId", authenticateJWT, deleteUser);
router.put("/users/avatar", authenticateJWT, updateAvatar);

// 👤 User Profile routes
router.get("/users/:userId", authenticateJWT, getUserProfile);
router.post("/users", authenticateJWT, createOrUpdateUserProfile);
router.put("/users/:userId", authenticateJWT, updateUserProfile);

// 📝 Forum routes
router.get("/threads", getAllThreads); // Public
router.get("/threads/:threadId", getThreadWithResponses); // Public
router.post("/threads", authenticateJWT, verifyCsrfToken, createThread); // Protected
router.post(
  "/threads/:threadId/responses",
  authenticateJWT,
  verifyCsrfToken,
  postResponseToThread
);

router.delete("/responses/:responseId", authenticateJWT, deleteResponse); // Protected

export default router;
