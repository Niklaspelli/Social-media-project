import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import {
  registerUser,
  loginUser,
  getCsrfToken,
  deleteUser,
  updateAvatar,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/csrf-token", getCsrfToken);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:userId", authenticateJWT, verifyCsrfToken, deleteUser);
router.put("/avatar", authenticateJWT, verifyCsrfToken, updateAvatar);

export default router;
