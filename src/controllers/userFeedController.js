import { db } from "../config/db.js";

export const createFeedPost = (req, res) => {
  const userId = req.user.id; // Get the logged-in user's ID from the request
  const { content } = req.body; // The content of the post

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required for the post." });
  }

  const sql = `INSERT INTO user_feed (userId, content) VALUES (?, ?)`;

  db.query(sql, [userId, content], (err, result) => {
    if (err) {
      console.error("Error creating feed post:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({ message: "Post created successfully" });
  });
};

export const getUserFeedPosts = (req, res) => {
  const userId = req.params.userId; // Getting the userId from URL params

  console.log("Fetching feed posts for user:", userId); // Debugging line

  const sql = `SELECT * FROM user_feed WHERE userId = ? ORDER BY timestamp DESC`; // Fetch posts for the logged-in user

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching feed posts:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Feed Posts from DB:", result); // Log the posts fetched from DB for debugging
    res.json(result); // Send the feed posts as a response
  });
};

export const getFullFeed = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      f.id,
      f.userId,
      f.content,
      f.created_at,
      u.username,
      u.avatar
    FROM user_feed f
    JOIN users u ON f.userId = u.id
    WHERE f.userId = ?
       OR f.userId IN (
         SELECT 
           CASE 
             WHEN sender_id = ? THEN receiver_id
             WHEN receiver_id = ? THEN sender_id
           END AS friend_id
         FROM friend_requests
         WHERE (sender_id = ? OR receiver_id = ?)
           AND status = 'accepted'
       )
    ORDER BY f.created_at DESC
  `;

  db.query(sql, [userId, userId, userId, userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching full feed:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.status(200).json(results);
  });
};
