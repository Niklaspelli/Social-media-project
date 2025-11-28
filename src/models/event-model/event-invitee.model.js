import { db } from "../../config/db.js";

export const getInviteesByEventId = (eventId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.id,
        u.username,
        u.avatar,
        ei.status
      FROM event_invitations ei
      JOIN users u ON ei.invited_user_id = u.id
      WHERE ei.event_id = ?
    `;

    db.query(sql, [eventId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
