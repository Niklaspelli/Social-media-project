import { db } from "../config/db.js";

export const createResponse = async ({ thread_id, body, user_id }) => {
  const [result] = await db.query(
    "INSERT INTO responses (thread_id, user_id, body, created_at) VALUES (?, ?, ?, NOW())",
    [thread_id, user_id, body]
  );
  return result.insertId;
};

export const getResponsesByThreadId = async (thread_id) => {
  const [rows] = await db.query(
    `SELECT r.*, u.username, u.avatar
     FROM responses r
     JOIN users u ON r.user_id = u.id
     WHERE r.thread_id = ?
     ORDER BY r.created_at ASC`,
    [thread_id]
  );
  return rows;
};

export const deleteResponseById = async (responseId, userId) => {
  const [result] = await db.query(
    "DELETE FROM responses WHERE id = ? AND user_id = ?",
    [responseId, userId]
  );
  return result.affectedRows > 0;
};
