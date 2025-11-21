import { db } from "../config/db.js";

export const getActivity = (req, res) => {
  const sql = `
    SELECT * FROM (
      -- Threads
      SELECT 
        'thread' AS type,
        t.id AS thread_id,
        t.title,
        t.avatar,
        t.created_at AS timestamp,
        u.username,
        s.title AS subject,
        NULL AS thread_title
      FROM threads t
      JOIN users u ON u.id = t.user_id
      LEFT JOIN subjects s ON s.subject_id = t.subject_id

      UNION ALL

      -- Responses
      SELECT
        'response' AS type,
        r.thread_id AS thread_id,
        r.body AS title,
        u.avatar,
        r.created_at AS timestamp,
        u.username,
        NULL AS subject,
        t.title AS thread_title
      FROM responses r
      JOIN users u ON u.id = r.user_id
      JOIN threads t ON t.id = r.thread_id
    ) AS activity
    ORDER BY timestamp DESC
    LIMIT 20
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch activity:", err);
      return res.status(500).json({ error: "Failed to fetch activity" });
    }
    res.json(results);
  });
};
