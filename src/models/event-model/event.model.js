import { db } from "../../config/db.js";

// Skapa nytt event
export const createEvent = ({
  creator_id,
  title,
  description,
  datetime,
  location,
  event_image,
}) => {
  const sql = `
    INSERT INTO events (creator_id, title, description, datetime, location, event_image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [creator_id, title, description, datetime, location, event_image],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

// Hämta alla events som användaren skapat och tacka ja till.
export const getUserEvents = (userId) => {
  const sql = `
    -- Events användaren har skapat
    SELECT 
      e.*,
      u.username AS creator_name,
      'creator' AS relation
    FROM events e
    JOIN users u ON e.creator_id = u.id
    WHERE e.creator_id = ?

    UNION ALL

    -- Events användaren tackat ja till
    SELECT 
      e.*,
      u.username AS creator_name,
      'attendee' AS relation
    FROM events e
    JOIN event_invitations ei ON e.id = ei.event_id
    JOIN users u ON e.creator_id = u.id
    WHERE ei.invited_user_id = ? AND ei.status = 'accepted'

    ORDER BY datetime ASC;
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [userId, userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Hämta event via ID
export const getEventById = (eventId) => {
  const sql = `SELECT * FROM events WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [eventId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
};

// Uppdatera event (endast titlar, beskrivning, tid, plats)
export const updateEvent = ({
  eventId,
  title,
  description,
  datetime,
  location,
}) => {
  const sql = `
    UPDATE events
    SET title = ?, description = ?, datetime = ?, location = ?
    WHERE id = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [title, description, datetime, location, eventId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      }
    );
  });
};

// Ta bort event
export const deleteEvent = (eventId) => {
  const sql = `DELETE FROM events WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [eventId], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

export const inviteUsers = (eventId, inviteeIds, invitedBy) => {
  const sql = `
    INSERT INTO event_invitations (event_id, invited_user_id, status)
    VALUES ?
  `;

  const values = inviteeIds.map((id) => [eventId, id, "pending"]);

  return new Promise((resolve, reject) => {
    db.query(sql, [values], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
