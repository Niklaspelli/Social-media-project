import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  createThread,
  getAllThreads,
  getThreadWithResponses,
} from "../controllers/forumController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Create a new thread
router.post("/threads", authenticateJWT, createThread);

// Get all threads
router.get("/threads", getAllThreads);

// Get a specific thread with responses
router.get("/threads/:threadId", getThreadWithResponses);

// Post a response to a specific thread
router.post("/threads/:threadId/responses", authenticateJWT, (req, res) => {
  const { threadId } = req.params;
  const { body } = req.body;
  const userId = req.user.id; // Assuming user ID is stored in the JWT token

  if (!body) {
    return res.status(400).json({ error: "Response body is required!" });
  }

  const insertResponseQuery =
    "INSERT INTO responses (thread_id, user_id, body) VALUES (?, ?, ?)";
  db.query(insertResponseQuery, [threadId, userId, body], (error, result) => {
    if (error) {
      console.error("Error posting response:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({
      message: "Response posted successfully.",
      response: {
        id: result.insertId,
        body,
        user_id: userId,
        created_at: new Date(), // Set the current date for the new response
      },
    });
  });
});

export default router;
