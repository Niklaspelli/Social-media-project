import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import {
  createOrUpdateUserProfile,
  updateUserProfile,
  getUserProfile,
} from "../controllers/userProfileController.js";

const router = express.Router();

router.get("/users/:userId", authenticateJWT, getUserProfile);
router.post("/users", authenticateJWT, createOrUpdateUserProfile);
router.put("/users", authenticateJWT, updateUserProfile);

export default router;
