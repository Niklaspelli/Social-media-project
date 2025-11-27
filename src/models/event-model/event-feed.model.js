import { db } from "../../config/db.js";

export const getEventFeedPosts = (eventId, limit = 10, offset = 0) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT em.id, em.user_id, em.event_id, em.content, em.created_at,
             u.username, u.avatar
      FROM event_messages em
      JOIN users u ON em.user_id = u.id
      WHERE em.event_id = ?
      ORDER BY em.created_at DESC
      LIMIT ? OFFSET ?;
    `;
    db.query(sql, [eventId, limit, offset], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const createEventFeedPost = (userId, eventId, content) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO event_messages (user_id, event_id, content) VALUES (?, ?, ?)`;
    db.query(sql, [userId, eventId, content], (err, result) => {
      if (err) return reject(err);
      resolve({
        id: result.insertId,
        user_id: userId,
        event_id: eventId,
        content,
        created_at: new Date(),
      });
    });
  });
};

export const deleteEventFeedPost = (userId, postId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM event_messages WHERE id = ? AND user_id = ?`;
    db.query(sql, [postId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};
