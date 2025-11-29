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

// Hämta responses till en tråd inkl. username, avatar, likes och userHasLiked, med pagination
export const getResponsesByThreadId = async (
  thread_id,
  user_id,
  offset = 0,
  limit = 5
) => {
  const sql = `
    SELECT 
      r.id, r.thread_id, r.body, r.user_id, r.created_at,
      u.username, u.avatar,

      -- Antal likes
      (SELECT COUNT(*) 
       FROM response_likes rl 
       WHERE rl.response_id = r.id) AS likeCount,

      -- Om användaren själv likeat
      (SELECT COUNT(*) 
       FROM response_likes rl2 
       WHERE rl2.response_id = r.id AND rl2.user_id = ?) AS userHasLiked

    FROM responses r
    JOIN users u ON r.user_id = u.id
    WHERE r.thread_id = ?
    ORDER BY r.created_at ASC
    LIMIT ? OFFSET ?
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [user_id, thread_id, limit, offset], (err, rows) => {
      if (err) return reject(err);

      const formatted = rows.map((row) => ({
        ...row,
        userHasLiked: row.userHasLiked > 0,
      }));

      resolve(formatted);
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
