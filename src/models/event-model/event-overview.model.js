import { db } from "../../config/db.js";

// models/event.model.js

// Hämta ett event med creator info
export const getEventById = (eventId) => {
  const sql = `
    SELECT 
      e.id, e.creator_id, e.title, e.description, e.datetime, e.location, e.event_image,
      u.username AS creator_name, u.avatar AS creator_avatar
    FROM events e
    JOIN users u ON e.creator_id = u.id
    WHERE e.id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [eventId], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

// Hämta alla invitees för ett event
export const getEventInvitees = (eventId) => {
  const sql = `
    SELECT u.id, u.username, u.avatar, ei.status
    FROM event_invitations ei
    JOIN users u ON ei.invited_user_id = u.id
    WHERE ei.event_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [eventId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Hämta feed posts för event med pagination
export const getEventFeedPosts = (eventId, limit = 10, offset = 0) => {
  const sql = `
    SELECT em.id, em.user_id, em.event_id, em.content, em.created_at,
           u.username, u.avatar
    FROM event_messages em
    JOIN users u ON em.user_id = u.id
    WHERE em.event_id = ?
    ORDER BY em.created_at DESC
    LIMIT ? OFFSET ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [eventId, limit, offset], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Hämta totalt antal feed posts
export const getEventFeedCount = (eventId) => {
  const sql = `SELECT COUNT(*) AS total FROM event_messages WHERE event_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [eventId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0].total || 0);
    });
  });
};
