import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
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

  getCompleteUserProfile
);
router.get("/users/:id", authenticateJWT, getOtherUserProfile);
router.get(
  "/search/users/:username",
  authenticateJWT,

  searchUser
);
router.get("/profile/:userId", authenticateJWT, getUserById);

export default router;
