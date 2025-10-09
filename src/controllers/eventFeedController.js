import { db } from "../config/db.js";

export const createEventFeedPost = (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id; // Get the logged-in user's ID from the request
  const { content } = req.body; // The content of the post

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required for the post." });
  }

  const sql = `INSERT INTO event_messages (user_id, content, event_id) VALUES (?, ?, ?)`;

  db.query(sql, [userId, content, eventId], (err, result) => {
    if (err) {
      console.error("Error creating feed eventpost:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      event_id: eventId,
      content,
      created_at: new Date(),
    });
  });
};

export const getEventFeedPosts = (req, res) => {
  const { eventId } = req.params; // Hämtar eventets ID från URL:en

  const sql = `
    SELECT
      em.id,
      em.user_id,
      em.event_id,
      em.content,
      em.created_at,
      u.username,
      u.avatar
    FROM event_messages em
    JOIN users u ON em.user_id = u.id
    WHERE em.event_id = ?  -- Filtrerar på eventet
    ORDER BY em.created_at DESC
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("Error fetching event feed posts:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.status(200).json(results); // Skickar alla inlägg med användarinformation
  });
};

export const deleteEventFeedPost = (req, res) => {
  const postId = req.params.postId; // använd korrekt param
  const userId = req.user.id;

  const sql = `DELETE FROM event_messages WHERE id = ? AND user_id = ?`;

  db.query(sql, [postId, userId], (err, result) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (result.affectedRows === 0)
      return res.status(403).json({ error: "Unauthorized or post not found" });
    res.status(200).json({ message: "Post deleted successfully" });
  });
};
