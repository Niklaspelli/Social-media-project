import { db } from "../config/db.js"; // Adjust this path based on your project structure

// Create a new thread
export const createThread = (req, res) => {
  const { title, body } = req.body;
  const { id: userId, username, avatar } = req.user; // 👈 get everything from req.user

  // Validate input
  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required!" });
  }

  // SQL query to insert a new thread
  const sql =
    "INSERT INTO threads (title, body, user_id, avatar, username) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [title, body, userId, avatar, username], (err, result) => {
    if (err) {
      console.error("Error inserting thread:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // Respond with the newly created thread data
    res.status(201).json({
      id: result.insertId,
      title,
      body,
      user_id: userId,
      avatar,
      username,
    });
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

// Like a response
export const likeResponse = (req, res) => {
  const { responseId } = req.params;
  const userId = req.user?.id;

  if (!responseId) {
    return res.status(400).json({ error: "Response ID is required!" });
  }

  const checkLikeSql =
    "SELECT * FROM response_likes WHERE response_id = ? AND user_id = ?";
  db.query(checkLikeSql, [responseId, userId], (err, result) => {
    if (err) {
      console.error("Error checking like:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({ error: "You have already liked this response." });
    }

    const insertLikeSql =
      "INSERT INTO response_likes (response_id, user_id) VALUES (?, ?)";
    db.query(insertLikeSql, [responseId, userId], (err) => {
      if (err) {
        console.error("Error inserting like:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Fetch updated like count
      const countSql =
        "SELECT COUNT(*) AS likeCount FROM response_likes WHERE response_id = ?";
      db.query(countSql, [responseId], (err, countResult) => {
        if (err) {
          console.error("Error fetching like count:", err.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(201).json({
          message: "Like added successfully!",
          likeCount: countResult[0].likeCount,
        });
      });
    });
  });
};

// Unlike a response
export const unlikeResponse = (req, res) => {
  const { responseId } = req.params;
  const userId = req.user?.id;

  if (!responseId) {
    return res.status(400).json({ error: "Response ID is required!" });
  }

  const deleteLikeSql =
    "DELETE FROM response_likes WHERE response_id = ? AND user_id = ?";
  db.query(deleteLikeSql, [responseId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting like:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Like not found." });
    }

    // Fetch updated like count
    const countSql =
      "SELECT COUNT(*) AS likeCount FROM response_likes WHERE response_id = ?";
    db.query(countSql, [responseId], (err, countResult) => {
      if (err) {
        console.error("Error fetching like count:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res
        .status(200)
        .json({
          message: "Like removed successfully!",
          likeCount: countResult[0].likeCount,
        });
    });
  });
};

// Get the like count for a response
export const getLikeCountForResponse = (req, res) => {
  const { responseId } = req.params; // Get responseId from the URL parameter

  // Query to count likes for the specific response
  const sql =
    "SELECT COUNT(*) AS likeCount FROM response_likes WHERE response_id = ?";
  db.query(sql, [responseId], (err, result) => {
    if (err) {
      console.error("Error fetching like count:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If result is empty, assume 0 likes
    const likeCount = result[0]?.likeCount || 0;

    // Return the like count
    res.status(200).json({ likeCount });
  });
};
