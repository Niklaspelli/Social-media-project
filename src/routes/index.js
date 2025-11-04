import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import forumRoutes from "./forumRoutes.js";
import friendRoutes from "./friendRoutes.js";
import feedRoutes from "./feedRoutes.js";
import eventRoutes from "./eventRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/forum", forumRoutes);
router.use("/friends", friendRoutes);
router.use("/feed", feedRoutes);
router.use("/events", eventRoutes);

export default router;
