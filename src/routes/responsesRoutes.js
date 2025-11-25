import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import {
  postResponseController,
  getResponsesByThreadController,
  deleteResponseController,
} from "../controllers/forumcontroller/response.controller.js";

const router = express.Router();

// Post a response
router.post(
  "/:threadId",
  authenticateJWT,
  verifyCsrfToken,
  postResponseController
);

// Get responses for a thread
router.get("/:threadId", getResponsesByThreadController);

// Delete a response
router.delete(
  "/:responseId",
  authenticateJWT,
  verifyCsrfToken,
  deleteResponseController
);

export default router;
