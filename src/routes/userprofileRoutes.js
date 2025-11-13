import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";

import {
  createOrUpdateUserProfile,
  updateUserProfile,
  getUserProfile,
} from "../controllers/userProfileController.js";

const router = express.Router();

router.get("/users/:userId", authenticateJWT, getUserProfile);
router.post(
  "/users",
  authenticateJWT,
  verifyCsrfToken,
  createOrUpdateUserProfile
);
router.put("/users", authenticateJWT, verifyCsrfToken, updateUserProfile);

export default router;
