import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import userprofileRoutes from "./userprofileRoutes.js";
/* import forumRoutes from "./forumRoutes.js";
 */ import friendRoutes from "./friendRoutes.js";
import feedRoutes from "./feedRoutes.js";
import eventRoutes from "./eventRoutes.js";
import eventFeedRoutes from "./eventFeedRoutes.js";
import activityRoutes from "./activityRoutes.js";

import threadRoutes from "./threadRoutes.js";
import subjectRoutes from "./subjectRoutes.js";
import likesRoutes from "./likesRoutes.js";
import responsesRoutes from "./responsesRoutes.js";
import overviewRoutes from "./overviewRoutes.js";

import { getCsrfToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/csrf-token", getCsrfToken);

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/userprofile", userprofileRoutes);
/* router.use("/forum", forumRoutes);
 */ router.use("/activity", activityRoutes);
router.use("/friends", friendRoutes);
router.use("/feed", feedRoutes);
router.use("/events", eventRoutes);
router.use("/eventfeed", eventFeedRoutes);

///Nya routes

router.use("/threads", threadRoutes);
router.use("/subjects", subjectRoutes);
router.use("/likes", likesRoutes);
router.use("/responses", responsesRoutes);
router.use("/overview", overviewRoutes);

export default router;
