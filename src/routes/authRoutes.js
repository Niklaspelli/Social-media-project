import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/auth-controller/auth-controller.js";

import { forgotPassword } from "../controllers/auth-controller/forgot-password-controller.js";
import { resetPassword } from "../controllers/auth-controller/reset-password-controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
