import { db } from "../config/db.js"; // Adjust this path based on your project structure

// Create a new thread
export const createThread = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id; // Assuming user ID is stored in the token

  // Validate input
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required!" });
  }

  // SQL query to insert a new thread
  const sql = "INSERT INTO threads (title, content, user_id) VALUES (?, ?, ?)";
  db.query(sql, [title, content, userId], (err, result) => {
    if (err) {
      console.error("Error inserting thread:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // Respond with the newly created thread data
    res.status(201).json({ id: result.insertId, title, content });
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
export const getThreadWithResponses = (req, res) => {
  const { threadId } = req.params; // Get thread ID from request parameters

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

    const thread = threadResults[0]; // Get the first result (the thread)

    // Fetch associated responses
    const responsesQuery = "SELECT * FROM responses WHERE thread_id = ?";
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

// Post a response to a thread
export const postResponseToThread = (req, res) => {
  const { threadId } = req.params;
  const { body } = req.body; // Extracting body from the request
  const userId = req.user.id; // Getting user ID from JWT token

  // Check if the response body is provided
  if (!body) {
    return res.status(400).json({ message: "Response body is required." });
  }

  // SQL query to insert a new response
  const insertResponseQuery =
    "INSERT INTO responses (thread_id, user_id, body) VALUES (?, ?, ?)";

  db.query(insertResponseQuery, [threadId, userId, body], (error, result) => {
    if (error) {
      console.error("Error posting response:", error);
      return res.status(500).json({ message: "Failed to post response." });
    }

    // Respond with the newly created response data
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
};
