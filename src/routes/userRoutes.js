import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import {
  getCompleteUserProfile,
  getUserById,
  getOtherUserProfile,
  searchUser,
} from "../controllers/userController.js";

const router = express.Router();

// 👤 User Profile routes
router.get(
  "/profile",
  authenticateJWT,
  verifyCsrfToken,
  getCompleteUserProfile
);
router.get("/users/:id", authenticateJWT, verifyCsrfToken, getOtherUserProfile);
router.get(
  "/search/users/:username",
  authenticateJWT,
  verifyCsrfToken,
  searchUser
);
router.get("/profile/:userId", authenticateJWT, verifyCsrfToken, getUserById);

export default router;
