import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";

import {
  getCompleteUserProfile,
  getUserById,
  getOtherUserProfile,
  searchUser,
} from "../controllers/userController.js";

import {
  updateAvatar,
  deleteUser,
} from "../controllers/auth-controller/user-controller.js";

const router = express.Router();

router.put("/avatar", authenticateJWT, verifyCsrfToken, updateAvatar);
router.delete("/:userId", authenticateJWT, verifyCsrfToken, deleteUser);

// 👤 User Profile routes
router.get("/profile", authenticateJWT, getCompleteUserProfile);
router.get("/users/:id", authenticateJWT, getOtherUserProfile);
router.get("/search/users/:username", authenticateJWT, searchUser);
router.get("/profile/:userId", authenticateJWT, getUserById);

export default router;
