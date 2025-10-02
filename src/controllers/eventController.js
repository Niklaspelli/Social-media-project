import { db } from "../config/db.js"; // justera efter din struktur

export const createEvent = (req, res) => {
  console.log("Body vid createEvent:", req.body);
  const { title, description, datetime, location, invitedUserIds } = req.body;
  const { id: userId } = req.user; // från auth middleware

  // Validering
  if (!title || !datetime || !location) {
    return res
      .status(400)
      .json({ error: "Title, datetime och location krävs!" });
  }

  // 1. Skapa event
  const insertEventSql = `
    INSERT INTO events (creator_id, title, description, datetime, location)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    insertEventSql,
    [userId, title, description, datetime, location],
    (err, result) => {
      if (err) {
        console.error("Fel vid skapande av event:", err.message);
        return res
          .status(500)
          .json({ error: "Internt serverfel vid eventskapande" });
      }

      const eventId = result.insertId;

      // 2. Lägg till inbjudningar om det finns
      if (Array.isArray(invitedUserIds) && invitedUserIds.length > 0) {
        const values = invitedUserIds.map((userId) => [eventId, userId]);
        const insertInvitationsSql = `
        INSERT INTO event_invitations (event_id, invited_user_id)
        VALUES ?
      `;
        db.query(insertInvitationsSql, [values], (invErr) => {
          if (invErr) {
            console.error("Fel vid inbjudningar:", invErr.message);
            return res
              .status(500)
              .json({ error: "Event skapades, men kunde inte bjuda in alla" });
          }

          // Allt klart
          res.status(201).json({
            id: eventId,
            title,
            description,
            datetime,
            location,
            creator_id: userId,
            invitedUserIds,
          });
        });
      } else {
        // Inga inbjudningar – klart direkt
        res.status(201).json({
          id: eventId,
          title,
          description,
          datetime,
          location,
          creator_id: userId,
          invitedUserIds: [],
        });
      }
    }
  );
};

export const getUserEvents = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT e.*, u.name AS creator_name,'creator' AS relation
    FROM events e
    JOIN users u ON e.creator_id = u.id
    WHERE e.creator_id = ?

    UNION

    SELECT e.*, u.name AS creator_name, 'invited' AS relation
    FROM events e
    JOIN event_invitations ei ON e.id = ei.event_id
    JOIN users u ON e.creator_id = u.id
    WHERE ei.invited_user_id = ?

    ORDER BY datetime ASC;
  `;

  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error("Fel vid hämtning av events:", err);
      return res.status(500).json({ error: "Internt serverfel" });
    }
    res.json(results);
  });
};

export const getEventInvitations = (req, res) => {
  const eventId = req.params.eventId;

  const sql = `
    SELECT u.id, u.name, u.email
    FROM event_invitations ei
    JOIN users u ON ei.invited_user_id = u.id
    WHERE ei.event_id = ?
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("Fel vid hämtning av inbjudningar:", err);
      return res.status(500).json({ error: "Internt serverfel" });
    }
    res.json(results);
  });
};

export const updateEvent = (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;
  const { title, description, datetime, location } = req.body;

  // Validering kan byggas ut

  // Kontroll att det är skaparen som uppdaterar
  const checkOwnerSql = "SELECT creator_id FROM events WHERE id = ?";

  db.query(checkOwnerSql, [eventId], (err, results) => {
    if (err) {
      console.error("Fel vid ägarkontroll:", err);
      return res.status(500).json({ error: "Internt serverfel" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Event hittades inte" });
    }
    if (results[0].creator_id !== userId) {
      return res
        .status(403)
        .json({ error: "Ej behörighet att uppdatera event" });
    }

    // Uppdatera eventet
    const updateSql = `
      UPDATE events SET title = ?, description = ?, datetime = ?, location = ?
      WHERE id = ?
    `;
    db.query(
      updateSql,
      [title, description, datetime, location, eventId],
      (updateErr) => {
        if (updateErr) {
          console.error("Fel vid uppdatering av event:", updateErr);
          return res
            .status(500)
            .json({ error: "Internt serverfel vid uppdatering" });
        }
        res.json({ message: "Event uppdaterat" });
      }
    );
  });
};

export const deleteEvent = (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  const checkOwnerSql = "SELECT creator_id FROM events WHERE id = ?";

  db.query(checkOwnerSql, [eventId], (err, results) => {
    if (err) {
      console.error("Fel vid ägarkontroll:", err);
      return res.status(500).json({ error: "Internt serverfel" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Event hittades inte" });
    }
    if (results[0].creator_id !== userId) {
      return res.status(403).json({ error: "Ej behörighet att ta bort event" });
    }

    const deleteSql = "DELETE FROM events WHERE id = ?";

    db.query(deleteSql, [eventId], (deleteErr) => {
      if (deleteErr) {
        console.error("Fel vid borttagning av event:", deleteErr);
        return res
          .status(500)
          .json({ error: "Internt serverfel vid borttagning" });
      }
      res.json({ message: "Event borttaget" });
    });
  });
};

export const getAllEvents = (req, res) => {
  const sql = `
    SELECT e.*, u.name AS creator_name
    FROM events e
    JOIN users u ON e.creator_id = u.id
    ORDER BY e.datetime ASC
    LIMIT 100
  `; // Begränsar till max 100 events för prestanda

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fel vid hämtning av events:", err);
      return res.status(500).json({ error: "Internt serverfel" });
    }
    res.json(results);
  });
};

export const getAllEventsPaginated = (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;
  if (page < 1) page = 1;

  const offset = (page - 1) * limit;

  const sql = `
    SELECT e.*, u.name AS creator_name
    FROM events e
    JOIN users u ON e.creator_id = u.id
    ORDER BY e.datetime ASC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [limit, offset], (err, results) => {
    if (err) {
      console.error("Fel vid hämtning av events:", err);
      return res.status(500).json({ error: "Internt serverfel" });
    }
    res.json({ page, limit, events: results });
  });
};
