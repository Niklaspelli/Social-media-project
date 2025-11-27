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

// Hämta alla events som skapats av en användare
export const getUserCreatedEvents = (userId) => {
  const sql = `
    SELECT * FROM events
    WHERE creator_id = ?
    ORDER BY datetime ASC
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [userId], (err, results) => {
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
