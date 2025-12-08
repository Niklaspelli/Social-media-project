import { db } from "../../config/db.js";

export const User = {
  updateLastSeen(userId, callback) {
    const sql = `UPDATE users SET last_seen = NOW() WHERE id = ?`;
    db.query(sql, [userId], callback);
  },
};
