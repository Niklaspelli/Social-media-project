import { db } from "../config/db.js";

// Hämta forum overview med trådmetadata + senaste response
export const getOverview = ({
  userId,
  limit = 6,
  offset = 0,
  sort = "desc",
  subjectId = null,
}) => {
  return new Promise((resolve, reject) => {
    const overview = {};

    // 1️⃣ Hämta subjects (statiska)
    db.query(
      "SELECT subject_id, title, description FROM subjects",
      (err, subjects) => {
        if (err) return reject(err);
        overview.subjects = subjects;

        // 2️⃣ Hämta threads med pagination, subject-filter och sort
        let threadsSql = `
        SELECT 
          t.id, t.title, t.body, t.subject_id, t.user_id, t.created_at,
          u.username, u.avatar,
          (SELECT COUNT(*) FROM responses r WHERE r.thread_id = t.id) AS total_responses,
          (
            SELECT JSON_OBJECT(
              'id', r2.id,
              'body', r2.body,
              'created_at', r2.created_at,
              'user', JSON_OBJECT(
                'id', u2.id,
                'username', u2.username,
                'avatar', u2.avatar
              )
            )
            FROM responses r2
            JOIN users u2 ON u2.id = r2.user_id
            WHERE r2.thread_id = t.id
            ORDER BY r2.created_at DESC
            LIMIT 1
          ) AS last_response,
          GREATEST(
            t.created_at, 
            IFNULL(
              (SELECT MAX(last_viewed) FROM user_thread_views v WHERE v.thread_id = t.id AND v.user_id = ?), 
              0
            )
          ) < t.created_at AS is_new
        FROM threads t
        JOIN users u ON u.id = t.user_id
      `;
        const params = [userId];

        if (subjectId) {
          threadsSql += " WHERE t.subject_id = ?";
          params.push(subjectId);
        }

        threadsSql += ` ORDER BY t.created_at ${
          sort.toLowerCase() === "asc" ? "ASC" : "DESC"
        } LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        db.query(threadsSql, params, (err, threads) => {
          if (err) return reject(err);

          overview.threads = threads.map((t) => ({
            id: t.id,
            title: t.title,
            body: t.body,
            subject_id: t.subject_id,
            user: { id: t.user_id, username: t.username, avatar: t.avatar },
            created_at: t.created_at,
            total_responses: t.total_responses,
            is_new: Boolean(t.is_new),
            last_response: t.last_response ? JSON.parse(t.last_response) : null,
          }));

          // 3️⃣ Total threads (med optional subject filter)
          let totalSql = "SELECT COUNT(*) AS total FROM threads";
          const totalParams = [];
          if (subjectId) {
            totalSql += " WHERE subject_id = ?";
            totalParams.push(subjectId);
          }

          db.query(totalSql, totalParams, (err, totalRows) => {
            if (err) return reject(err);
            overview.totalThreads = totalRows[0].total;
            overview.page = offset / limit + 1;
            overview.limit = limit;

            resolve(overview);
          });
        });
      }
    );
  });
};
