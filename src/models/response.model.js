import { db } from "../config/db.js";

// Skapa en ny response
export const createResponse = async ({ thread_id, body, user_id }) => {
  const sql = `
    INSERT INTO responses (thread_id, user_id, body, created_at)
    VALUES (?, ?, ?, NOW())
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [thread_id, user_id, body], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Hämta alla responses till en tråd inkl. username och avatar
export const getResponsesByThreadId = async (thread_id) => {
  const sql = `
    SELECT r.id, r.thread_id, r.body, r.user_id, r.created_at,
           u.username, u.avatar,
           (SELECT COUNT(*) FROM response_likes rl WHERE rl.response_id = r.id) AS likeCount
    FROM responses r
    JOIN users u ON r.user_id = u.id
    WHERE r.thread_id = ?
    ORDER BY r.created_at ASC
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [thread_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Ta bort en response (endast ägaren)
export const deleteResponseById = async (responseId, userId) => {
  const sql = `DELETE FROM responses WHERE id = ? AND user_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [responseId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};
