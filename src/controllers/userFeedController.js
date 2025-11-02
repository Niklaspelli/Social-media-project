import { db } from "../config/db.js";

export const createFeedPost = (req, res) => {
  const userId = req.user.id; // Get the logged-in user's ID from the request
  const { content } = req.body; // The content of the post

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required for the post." });
  }

  const sql = `INSERT INTO user_feed (userId, content) VALUES (?, ?)`;

  db.query(sql, [userId, content], (err) => {
    if (err) {
      console.error("Error creating feed post:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({ message: "Post created successfully" });
  });
};

export const getUserFeedPosts = (req, res) => {
  const userId = req.params.userId;
  console.log("req.user.id:", req.user.id);
  console.log("req.params.userId:", req.params.userId);

  const sql = `
    SELECT
      uf.id,
      uf.content,
      uf.created_at,
      u.username
    FROM user_feed uf
    JOIN users u ON uf.userId = u.id
    WHERE uf.userId = ?  -- Filter posts for the specific user
    ORDER BY uf.created_at DESC;  -- Optionally order by created_at, newest first
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user feed posts:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json(result); // Send posts with username
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

export const deleteFeedPost = (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  const sql = `DELETE from user_feed WHERE id= ? AND userId = ?`;

  db.query(sql, [postId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting feed post:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Unauthorized or post not found" });
    }

    res.status(200).json({ message: "Feed post deleted successfully" });
  });
};

export const getFriendFeed = (req, res) => {
  const userId = req.user.id;

  const sql = `
  SELECT uf.*, u.username, u.avatar
  FROM user_feed uf
  JOIN users u ON uf.userId = u.id
  WHERE uf.userId IN (
    SELECT 
      CASE 
        WHEN sender_id = ? THEN receiver_id
        WHEN receiver_id = ? THEN sender_id
      END
    FROM friend_requests
    WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted'
  )
  ORDER BY uf.created_at DESC;
`;

  db.query(sql, [userId, userId, userId, userId], (err, result) => {
    if (err) {
      console.error("Error fetching friends' posts:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(result);
  });
};
