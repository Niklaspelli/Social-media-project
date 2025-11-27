import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { overviewController } from "../controllers/forumcontroller/overview.controller.js";

const router = express.Router();

router.get("/", authenticateJWT, overviewController);

export default router;
