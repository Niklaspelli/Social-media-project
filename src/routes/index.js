import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import userprofileRoutes from "./userprofileRoutes.js";
import friendRoutes from "./friendRoutes.js";
import feedRoutes from "./feedRoutes.js";
import eventOverviewRoutes from "./eventOverviewRoutes.js";
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
 */
router.use("/friends", friendRoutes);
router.use("/feed", feedRoutes);

///Nya routes forum

router.use("/threads", threadRoutes);
router.use("/subjects", subjectRoutes);
router.use("/likes", likesRoutes);
router.use("/responses", responsesRoutes);
router.use("/overview", overviewRoutes);
router.use("/activity", activityRoutes);

///Nya routes event

router.use("/events", eventOverviewRoutes);
router.use("/events/user", eventRoutes);
router.use("/events/", eventFeedRoutes);
export default router;
