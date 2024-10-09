import { db } from "../config/db.js"; // Adjust this path based on your project structure

// Create a new thread
export const createThread = (req, res) => {
  const { title, body } = req.body;
  const userId = req.user.id; // Assuming user ID is stored in the token

  // Validate input
  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required!" });
  }

  // SQL query to insert a new thread
  const sql = "INSERT INTO threads (title, body, user_id) VALUES (?, ?, ?)";
  db.query(sql, [title, body, userId], (err, result) => {
    if (err) {
      console.error("Error inserting thread:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // Respond with the newly created thread data
    res.status(201).json({ id: result.insertId, title, body });
  });
};

// Get all threads
export const getAllThreads = (req, res) => {
  const sql = "SELECT * FROM threads"; // SQL query to fetch all threads
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching threads:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // Respond with the list of threads
    res.status(200).json(results);
  });
};

// Get a specific thread with responses
// Get a specific thread with responses
export const getThreadWithResponses = (req, res) => {
  const { threadId } = req.params;

  // Query to fetch the specified thread
  const threadQuery = "SELECT * FROM threads WHERE id = ?";
  db.query(threadQuery, [threadId], (err, threadResults) => {
    if (err) {
      console.error("Database error while fetching thread:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (threadResults.length === 0) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const thread = threadResults[0];

    // Fetch associated responses along with usernames and avatars
    const responsesQuery = `
      SELECT responses.*, users.username, users.avatar 
      FROM responses 
      JOIN users ON responses.user_id = users.id 
      WHERE thread_id = ?
    `;
    db.query(responsesQuery, [threadId], (err, responsesResults) => {
      if (err) {
        console.error("Database error while fetching responses:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // Respond with the thread and its responses
      res.json({ thread, responses: responsesResults });
    });
  });
};

export const postResponseToThread = (req, res) => {
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

    // Fetch user data including avatar URL
    const fetchUserQuery = "SELECT username, avatar FROM users WHERE id = ?";
    db.query(fetchUserQuery, [userId], (err, userResult) => {
      if (err) {
        console.error("Error fetching user data:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if user exists
      if (userResult.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const { username, avatar } = userResult[0];

      res.status(201).json({
        message: "Response posted successfully.",
        response: {
          id: result.insertId,
          body,
          user_id: userId,
          username, // Add username
          avatar, // Add avatar URL
          created_at: new Date(), // Set the current date for the new response
        },
      });
    });
  });
};

export const deleteResponse = (req, res) => {
  const { responseId } = req.params;
  const userId = req.user?.id; // Get the authenticated user's ID from the request

  // Check for user authentication
  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  // SQL query to delete the response only if it belongs to the authenticated user
  const sql = `DELETE FROM responses WHERE id = ? AND user_id = ?`;

  db.query(sql, [responseId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting response:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the response was deleted
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Response not found or unauthorized" });
    }

    // Optional: Log successful deletion
    console.log(`Response with ID ${responseId} deleted by user ${userId}.`);

    res.status(200).json({ message: "Response deleted successfully." });
  });
};
