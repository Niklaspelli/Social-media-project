import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import {
  createThread,
  getAllThreads,
  getThreadWithResponses,
  postResponseToThread,
  deleteResponse,
  likeResponse,
  unlikeResponse,
  getLikeCountForResponse,
  getSubjects,
} from "../controllers/forumController.js";

const router = express.Router();

router.get("/threads", getAllThreads); // Public
router.get("/threads/:threadId", getThreadWithResponses); // Public
router.post("/threads", authenticateJWT, verifyCsrfToken, createThread); // Protected
router.post(
  "/threads/:threadId/responses",
  authenticateJWT,
  verifyCsrfToken,
  postResponseToThread
);
router.get("/subjects", getSubjects); // Public

//response routes
router.delete(
  "/responses/:responseId",
  authenticateJWT,
  verifyCsrfToken,
  deleteResponse
); // Protected

router.post(
  "/responses/:responseId/like", // Use :responseId to make it dynamic
  authenticateJWT,
  verifyCsrfToken,
  likeResponse
);

router.delete(
  "/responses/:responseId/like", // Use :responseId to make it dynamic
  authenticateJWT,
  verifyCsrfToken,
  unlikeResponse
);
router.get("/responses/:responseId/like-count", getLikeCountForResponse);
export default router;
