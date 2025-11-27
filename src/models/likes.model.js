import { db } from "../config/db.js";

// Toggle like/unlike på en response
export const toggleLike = (user_id, response_id) => {
  return new Promise((resolve, reject) => {
    // Kolla om like redan finns
    const checkSql = `
      SELECT * FROM response_likes 
      WHERE user_id = ? AND response_id = ?
    `;

    db.query(checkSql, [user_id, response_id], (err, rows) => {
      if (err) return reject(err);

      // Finns -> ta bort (unlike)
      if (rows.length > 0) {
        const deleteSql = `
          DELETE FROM response_likes 
          WHERE user_id = ? AND response_id = ?
        `;

        db.query(deleteSql, [user_id, response_id], (err2) => {
          if (err2) return reject(err2);
          resolve({ liked: false });
        });
      } else {
        // Finns inte -> lägg till (like)
        const insertSql = `
          INSERT INTO response_likes (user_id, response_id) 
          VALUES (?, ?)
        `;

        db.query(insertSql, [user_id, response_id], (err2) => {
          if (err2) return reject(err2);
          resolve({ liked: true });
        });
      }
    });
  });
};

// Hämta antal likes för en response
export const getLikeCount = (response_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) AS likeCount 
      FROM response_likes 
      WHERE response_id = ?
    `;

    db.query(sql, [response_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].likeCount);
    });
  });
};

// Kolla om användaren själv har likeat
export const userHasLiked = (user_id, response_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) AS liked 
      FROM response_likes 
      WHERE user_id = ? AND response_id = ?
    `;

    db.query(sql, [user_id, response_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].liked > 0);
    });
  });
};
