import { db } from "../config/db.js";

// Skapa en ny thread
export const createThread = (
  { title, body, user_id, subject_id },
  callback
) => {
  const sql = `
    INSERT INTO threads (title, body, user_id, subject_id, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [title, body, user_id, subject_id], (err, result) => {
    if (err) return callback(err);
    callback(null, result.insertId);
  });
};

// Hämta threads för ett subject med pagination
export const getThreadsBySubject = (subject_id, limit, offset, callback) => {
  const sql = `
    SELECT * FROM threads
    WHERE subject_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;
  db.query(sql, [subject_id, limit, offset], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};

// Räkna antal threads för ett subject
export const countThreadsBySubject = (subject_id, callback) => {
  const sql = "SELECT COUNT(*) AS total FROM threads WHERE subject_id = ?";
  db.query(sql, [subject_id], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows[0].total);
  });
};

// Hämta thread med ID
export const getThreadById = (id, callback) => {
  const sql = "SELECT * FROM threads WHERE id = ?";
  db.query(sql, [id], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows[0]);
  });
};

// Hämta senaste threads med pagination
export const getLatestThreads = (limit, offset, callback) => {
  const sql = `
    SELECT * FROM threads
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;
  db.query(sql, [limit, offset], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};

// Räkna alla threads
export const countAllThreads = (callback) => {
  const sql = "SELECT COUNT(*) AS total FROM threads";
  db.query(sql, (err, rows) => {
    if (err) return callback(err);
    callback(null, rows[0].total);
  });
};
