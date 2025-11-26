import { db } from "../config/db.js";

// Skapa en ny thread
export const createThread = async ({ title, body, user_id, subject_id }) => {
  const sql = `
    INSERT INTO threads (title, body, user_id, subject_id, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [title, body, user_id, subject_id], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

// Hämta threads för ett subject med pagination
export const getThreadsBySubject = async (subject_id, limit, offset) => {
  const sql = `
    SELECT t.*, u.username, u.avatar,
           (SELECT COUNT(*) FROM responses r WHERE r.thread_id = t.id) AS responses_count
    FROM threads t
    JOIN users u ON t.user_id = u.id
    WHERE t.subject_id = ?
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [subject_id, limit, offset], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Räkna antal threads för ett subject
export const countThreadsBySubject = async (subject_id) => {
  const sql = "SELECT COUNT(*) AS total FROM threads WHERE subject_id = ?";
  return new Promise((resolve, reject) => {
    db.query(sql, [subject_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].total);
    });
  });
};

// Hämta thread med ID inkl. användarinformation
export const getThreadById = async (id) => {
  const sql = `
    SELECT t.*, u.username, u.avatar
    FROM threads t
    JOIN users u ON t.user_id = u.id
    WHERE t.id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

// Hämta senaste threads med pagination
export const getLatestThreads = async (limit, offset) => {
  const sql = `
    SELECT t.*, u.username, u.avatar,
           (SELECT COUNT(*) FROM responses r WHERE r.thread_id = t.id) AS responses_count
    FROM threads t
    JOIN users u ON t.user_id = u.id
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [limit, offset], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Räkna alla threads
export const countAllThreads = async () => {
  const sql = "SELECT COUNT(*) AS total FROM threads";
  return new Promise((resolve, reject) => {
    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].total);
    });
  });
};
