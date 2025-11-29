import { db } from "../config/db.js";

// Hämta forum overview med max 5 responses per thread
export const getOverview = ({
  userId,
  limit = 6,
  offset = 0,
  sort = "desc",
  subjectId = null,
}) => {
  return new Promise((resolve, reject) => {
    const overview = {};

    // 1️⃣ Hämta subjects
    db.query(
      "SELECT subject_id, title, description FROM subjects",
      (err, subjects) => {
        if (err) return reject(err);
        overview.subjects = subjects;

        // 2️⃣ Hämta threads med pagination, subject-filter och sort
        let threadsSql = `
        SELECT t.id, t.title, t.body, t.subject_id, t.user_id, t.created_at,
               u.username, u.avatar,
               (SELECT COUNT(*) FROM responses r WHERE r.thread_id = t.id) AS total_responses,
               GREATEST(t.created_at, IFNULL((SELECT MAX(last_viewed)
                                              FROM user_thread_views v
                                              WHERE v.thread_id = t.id AND v.user_id = ?), 0)) < t.created_at AS is_new
        FROM threads t
        JOIN users u ON t.user_id = u.id
      `;
        const threadParams = [userId];

        if (subjectId) {
          threadsSql += " WHERE t.subject_id = ?";
          threadParams.push(subjectId);
        }

        threadsSql += ` ORDER BY t.created_at ${
          sort.toLowerCase() === "asc" ? "ASC" : "DESC"
        } LIMIT ? OFFSET ?`;
        threadParams.push(limit, offset);

        db.query(threadsSql, threadParams, (err, threads) => {
          if (err) return reject(err);

          if (threads.length === 0) {
            overview.threads = [];
            overview.totalThreads = 0;
            return resolve(overview);
          }

          // 3️⃣ Hämta max 5 responses per thread
          const threadIds = threads.map((t) => t.id);
          const responsesSql = `
          SELECT r.id, r.thread_id, r.body, r.user_id, r.created_at,
                 u.username, u.avatar
          FROM responses r
          JOIN users u ON r.user_id = u.id
          WHERE r.thread_id IN (?)
          ORDER BY r.created_at ASC
        `;
          db.query(responsesSql, [threadIds], (err, responses) => {
            if (err) return reject(err);

            // Gruppera responses per thread och max 5
            const responsesPerThread = {};
            responses.forEach((r) => {
              if (!responsesPerThread[r.thread_id])
                responsesPerThread[r.thread_id] = [];
              if (responsesPerThread[r.thread_id].length < 5) {
                responsesPerThread[r.thread_id].push({
                  id: r.id,
                  body: r.body,
                  user: {
                    id: r.user_id,
                    username: r.username,
                    avatar: r.avatar,
                  },
                  created_at: r.created_at,
                });
              }
            });

            // 4️⃣ Lägg responses i threads
            overview.threads = threads.map((t) => ({
              id: t.id,
              title: t.title,
              body: t.body,
              subject_id: t.subject_id,
              user: { id: t.user_id, username: t.username, avatar: t.avatar },
              created_at: t.created_at,
              total_responses: t.total_responses,
              is_new: Boolean(t.is_new),
              responses: responsesPerThread[t.id] || [],
            }));

            // 5️⃣ Total threads (med optional subject filter)
            let totalSql = "SELECT COUNT(*) AS total FROM threads";
            const totalParams = [];
            if (subjectId) {
              totalSql += " WHERE subject_id = ?";
              totalParams.push(subjectId);
            }

            db.query(totalSql, totalParams, (err, totalRows) => {
              if (err) return reject(err);
              overview.totalThreads = totalRows[0].total;

              resolve(overview);
            });
          });
        });
      }
    );
  });
};
