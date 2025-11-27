import { db } from "../config/db.js";

export const getActivity = (userId) => {
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
        NULL AS thread_title,
        CASE
          WHEN utv.thread_id IS NULL OR utv.last_viewed < t.created_at THEN 1
          ELSE 0
        END AS is_new,
        NULL AS likeCount,
        CONCAT('/threads/', t.id) AS thread_url,
        NULL AS response_url
      FROM threads t
      JOIN users u ON u.id = t.user_id
      LEFT JOIN subjects s ON s.subject_id = t.subject_id
      LEFT JOIN user_thread_views utv
        ON utv.thread_id = t.id AND utv.user_id = ?

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
        t.title AS thread_title,
        0 AS is_new,
        COALESCE(like_counts.likeCount, 0) AS likeCount,
        NULL AS thread_url,
        CONCAT('/threads/', r.thread_id, '#response-', r.id) AS response_url
      FROM responses r
      JOIN users u ON u.id = r.user_id
      JOIN threads t ON t.id = r.thread_id
      LEFT JOIN (
        SELECT response_id, COUNT(*) AS likeCount
        FROM response_likes
        GROUP BY response_id
      ) AS like_counts
        ON like_counts.response_id = r.id
    ) AS activity
    ORDER BY timestamp DESC
    LIMIT 20
  `;

  const threadCountSql = `
    SELECT COUNT(*) AS totalThreads
    FROM threads
    WHERE user_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [userId], (err, activityResults) => {
      if (err) return reject(err);

      db.query(threadCountSql, [userId], (err, countResults) => {
        if (err) return reject(err);
        const threadCount = countResults[0].totalThreads;
        resolve({ threadCount, activity: activityResults });
      });
    });
  });
};
