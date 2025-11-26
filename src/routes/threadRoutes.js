import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";

import {
  createThreadController,
  getLatestThreadsController,
  getThreadsController, // ändrat namn för callback-versionen
  getThreadController, // ändrat namn för callback-versionen
} from "../controllers/forumcontroller/thread.controller.js";

const router = express.Router();

// Skapa ny thread (protected)
router.post(
  "/create-thread",
  authenticateJWT,
  verifyCsrfToken,
  createThreadController
);

// Hämta senaste threads med optional query params ?limit=10&page=1
router.get("/threads", getLatestThreadsController);

// Hämta threads för ett specifikt subject (query param: ?subject_id=1)
router.get("/threads/subject", getThreadsController);

// Hämta en thread med alla detaljer
router.get("/threads/:threadId", getThreadController);

export default router;
