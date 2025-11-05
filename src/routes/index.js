import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import userprofileRoutes from "./userprofileRoutes.js";
import forumRoutes from "./forumRoutes.js";
import friendRoutes from "./friendRoutes.js";
import feedRoutes from "./feedRoutes.js";
import eventRoutes from "./eventRoutes.js";
import eventFeedRoutes from "./eventFeedRoutes.js";
import { getCsrfToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/csrf-token", getCsrfToken);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/userprofile", userprofileRoutes);
router.use("/forum", forumRoutes);
router.use("/friends", friendRoutes);
router.use("/feed", feedRoutes);
router.use("/events", eventRoutes);
router.use("/eventfeed", eventFeedRoutes);

export default router;
