import { db } from "../../config/db.js";

// Hämta inkommande pending invitations
export const getPendingInvitationsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        ei.event_id,
        e.title,
        e.description,
        e.datetime,
        e.location,
        u.username AS creator_name,
        u.avatar AS creator_avatar
      FROM event_invitations ei
      JOIN events e ON ei.event_id = e.id
      JOIN users u ON e.creator_id = u.id
      WHERE ei.invited_user_id = ? AND ei.status = 'pending'
    `;

    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Count pending invitations
export const getPendingInvitationCount = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT COUNT(*) AS count
      FROM event_invitations
      WHERE invited_user_id = ? AND status = 'pending'
    `;

    db.query(sql, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0].count || 0);
    });
  });
};

// Accept invitation
export const acceptEventInvitationDB = (eventId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE event_invitations
      SET status = 'accepted'
      WHERE event_id = ? AND invited_user_id = ? AND status = 'pending'
    `;

    db.query(sql, [eventId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Reject invitation
export const rejectEventInvitationDB = (eventId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE event_invitations
      SET status = 'rejected'
      WHERE event_id = ? AND invited_user_id = ? AND status = 'pending'
    `;

    db.query(sql, [eventId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
