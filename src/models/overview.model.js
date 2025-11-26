import { db } from "../config/db.js";

// Hämta forum overview
export const getOverview = (userId, limit, offset, callback) => {
  const overview = {};

  // 1️⃣ Hämta subjects
  db.query(
    "SELECT subject_id, title, description FROM subjects",
    (err, subjects) => {
      if (err) return callback(err);
      overview.subjects = subjects;

      // 2️⃣ Hämta threads med pagination
      const threadsSql = `
        SELECT t.id, t.title, t.body, t.subject_id, t.user_id, t.created_at,
               u.username, u.avatar,
               (SELECT COUNT(*) FROM responses r WHERE r.thread_id = t.id) AS responses_count,
               GREATEST(t.created_at, IFNULL((SELECT MAX(last_viewed) 
                                              FROM user_thread_views v 
                                              WHERE v.thread_id = t.id AND v.user_id = ?), 0)) < t.created_at AS is_new
        FROM threads t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
        LIMIT ? OFFSET ?
      `;

      db.query(threadsSql, [userId, limit, offset], (err, threads) => {
        if (err) return callback(err);

        if (threads.length === 0) {
          overview.threads = [];
          overview.totalThreads = 0;
          return callback(null, overview);
        }

        // 3️⃣ Hämta responses per thread
        const threadIds = threads.map((t) => t.id);
        const responsesSql = `
          SELECT r.id, r.thread_id, r.body, r.user_id, r.created_at,
                 u.username, u.avatar,
                 (SELECT COUNT(*) FROM response_likes rl WHERE rl.response_id = r.id) AS likeCount
          FROM responses r
          JOIN users u ON r.user_id = u.id
          WHERE r.thread_id IN (?)
          ORDER BY r.created_at ASC
        `;

        db.query(responsesSql, [threadIds], (err, responses) => {
          if (err) return callback(err);

          // Gruppera responses per thread
          const responsesPerThread = {};
          responses.forEach((r) => {
            if (!responsesPerThread[r.thread_id])
              responsesPerThread[r.thread_id] = [];
            responsesPerThread[r.thread_id].push({
              id: r.id,
              body: r.body,
              user: {
                id: r.user_id,
                username: r.username,
                avatar: r.avatar,
              },
              created_at: r.created_at,
              likeCount: r.likeCount,
            });
          });

          // Lägg till responses i varje thread
          overview.threads = threads.map((t) => ({
            id: t.id,
            title: t.title,
            body: t.body,
            subject_id: t.subject_id,
            user: {
              id: t.user_id,
              username: t.username,
              avatar: t.avatar,
            },
            created_at: t.created_at,
            responses_count: t.responses_count,
            is_new: Boolean(t.is_new),
            responses: responsesPerThread[t.id] || [],
          }));

          // 4️⃣ Total threads
          db.query(
            "SELECT COUNT(*) AS total FROM threads",
            (err, totalRows) => {
              if (err) return callback(err);
              overview.totalThreads = totalRows[0].total;

              callback(null, overview);
            }
          );
        });
      });
    }
  );
};
