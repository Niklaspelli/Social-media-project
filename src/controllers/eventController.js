import { db } from "../config/db.js"; // justera efter din struktur

export const createEvent = (req, res) => {
  console.log("Body vid createEvent:", req.body);
  const { title, description, datetime, location, invitedUserIds } = req.body;
  const { id: userId } = req.user;

  if (!title || !datetime || !location) {
    return res
      .status(400)
      .json({ error: "Title, datetime och location krävs!" });
  }

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

      // ✅ Hämta användarens namn (och ev. avatar)
      const getUserSql = "SELECT username, avatar FROM users WHERE id = ?";
      db.query(getUserSql, [userId], (userErr, userResult) => {
        if (userErr) {
          console.error("Fel vid hämtning av användare:", userErr.message);
          return res.status(500).json({
            error: "Event skapades men kunde inte hämta användardata",
          });
        }

        const { username: creator_name, avatar } = userResult[0] || {};

        // 📩 Skapa inbjudningar om några valdes
        if (Array.isArray(invitedUserIds) && invitedUserIds.length > 0) {
          const values = invitedUserIds.map((inviteeId) => [
            eventId,
            inviteeId,
          ]);
          const insertInvitationsSql = `
          INSERT INTO event_invitations (event_id, invited_user_id)
          VALUES ?
        `;
          db.query(insertInvitationsSql, [values], (invErr) => {
            if (invErr) {
              console.error("Fel vid inbjudningar:", invErr.message);
              return res
                .status(500)
                .json({ error: "Event skapades men kunde inte bjuda in alla" });
            }

            res.status(201).json({
              message: "Event skapades!",
              event: {
                id: eventId,
                title,
                description,
                datetime,
                location,
                creator_id: userId,
                creator_name,
                avatar,
                invitedUserIds,
              },
            });
          });
        } else {
          // 🟢 Inga inbjudningar
          res.status(201).json({
            message: "Event skapades!",
            event: {
              id: eventId,
              title,
              description,
              datetime,
              location,
              creator_id: userId,
              creator_name,
              avatar,
              invitedUserIds: [],
            },
          });
        }
      });
    }
  );
};

export const getUserEvents = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      e.id,
      e.creator_id,
      e.title,
      e.description,
      e.datetime,
      e.location,
      e.created_at,
      u.username AS creator_name,
      'creator' AS relation
    FROM events e
    JOIN users u ON e.creator_id = u.id
    WHERE e.creator_id = ?

    UNION ALL

    SELECT 
      e.id,
      e.creator_id,
      e.title,
      e.description,
      e.datetime,
      e.location,
      e.created_at,
      u.username AS creator_name,
      'invited' AS relation
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
    SELECT e.*, u.username AS creator_name
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
    SELECT e.*, u.username AS creator_name
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

export const getIncomingEventInvitations = (req, res) => {
  const userId = req.user.id;

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
    if (err) {
      console.error("Error fetching event invitations:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results);
  });
};

export const getIncomingEventInvitationCount = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT COUNT(*) AS count
    FROM event_invitations
    WHERE invited_user_id = ? AND status = 'pending'
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching event invitation count:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const count = results[0].count || 0;
    res.json({ count });
  });
};

export const acceptEventInvitation = (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body; // ← ändrat från req.params

  const sql = `
    UPDATE event_invitations
    SET status = 'accepted'
    WHERE event_id = ? AND invited_user_id = ? AND status = 'pending'
  `;

  db.query(sql, [eventId, userId], (err, result) => {
    if (err) {
      console.error("Error accepting event invitation:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No pending invitation found" });
    }

    res.status(200).json({ message: "Invitation accepted" });
  });
};

export const rejectEventInvitation = (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body; // ← ändrat från req.params

  const sql = `
    UPDATE event_invitations
    SET status = 'rejected'
    WHERE event_id = ? AND invited_user_id = ? AND status = 'pending'
  `;

  db.query(sql, [eventId, userId], (err, result) => {
    if (err) {
      console.error("Error rejecting event invitation:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No pending invitation found" });
    }

    res.status(200).json({ message: "Invitation rejected" });
  });
};
