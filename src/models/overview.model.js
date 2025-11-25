import { db } from "../config/db.js";

export const getOverview = (userId, limit, offset, callback) => {
  const overview = {};

  // 1. Hämta subjects
  db.query(
    "SELECT subject_id, title, description FROM subjects",
    (err, subjects) => {
      if (err) return callback(err);
      overview.subjects = subjects;

      // 2. Hämta threads
      const threadsSql = `
      SELECT t.id, t.title, LEFT(t.body, 100) AS snippet, t.subject_id, t.user_id,
             t.created_at, u.username, u.avatar,
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
        overview.threads = threads.map((t) => ({
          id: t.id,
          title: t.title,
          snippet: t.snippet,
          subject_id: t.subject_id,
          user: {
            id: t.user_id,
            username: t.username,
            avatar: t.avatar,
          },
          created_at: t.created_at,
          responses_count: t.responses_count,
          is_new: Boolean(t.is_new),
        }));

        // 3. Hämta total threads
        db.query(
          "SELECT COUNT(*) AS total FROM threads",
          (err, totalThreadsRows) => {
            if (err) return callback(err);
            overview.totalThreads = totalThreadsRows[0].total;

            // 4. Hämta top users
            const topUsersSql = `
          SELECT u.id, u.username, u.avatar,
                 (SELECT COUNT(*) FROM threads t WHERE t.user_id = u.id) AS threads_created,
                 (SELECT COUNT(*) FROM responses r WHERE r.user_id = u.id) AS responses_posted
          FROM users u
          ORDER BY threads_created DESC
          LIMIT 5
        `;
            db.query(topUsersSql, (err, topUsers) => {
              if (err) return callback(err);

              // 5. Hämta total responses
              db.query(
                "SELECT COUNT(*) AS total FROM responses",
                (err, totalResponsesRows) => {
                  if (err) return callback(err);

                  overview.stats = {
                    total_responses: totalResponsesRows[0].total,
                    top_users: topUsers.map((u) => ({
                      id: u.id,
                      username: u.username,
                      avatar: u.avatar,
                      threads_created: u.threads_created,
                      responses_posted: u.responses_posted,
                    })),
                  };

                  // Slutligen returnera hela overview via callback
                  callback(null, overview);
                }
              );
            });
          }
        );
      });
    }
  );
};
