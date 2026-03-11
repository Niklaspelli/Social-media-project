import { db } from "../../config/db.js";

export const FriendRequest = {
  findRelation(senderId, receiverId, callback) {
    const sql = `
      SELECT status FROM friend_requests
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      LIMIT 1
    `;
    db.query(sql, [senderId, receiverId, receiverId, senderId], callback);
  },

  create(senderId, receiverId, callback) {
    const sql = `
      INSERT INTO friend_requests (sender_id, receiver_id, status)
      VALUES (?, ?, 'pending')
    `;
    db.query(sql, [senderId, receiverId], callback);
  },

  accept(senderId, receiverId, callback) {
    const sql = `
      UPDATE friend_requests
      SET status = 'accepted'
      WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
    `;
    db.query(sql, [senderId, receiverId], callback);
  },

  reject(senderId, receiverId, callback) {
    const sql = `
      UPDATE friend_requests
      SET status = 'rejected'
      WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
    `;
    db.query(sql, [senderId, receiverId], callback);
  },

  delete(senderId, receiverId, callback) {
    const sql = `
      DELETE FROM friend_requests
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
    `;
    db.query(sql, [senderId, receiverId, receiverId, senderId], callback);
  },

  getFriends(userId, callback) {
    const sql = `
      SELECT u.id, u.username, u.avatar, u.last_seen, fr.status
      FROM users u
      JOIN friend_requests fr ON (
        (fr.sender_id = u.id AND fr.receiver_id = ?)
        OR
        (fr.receiver_id = u.id AND fr.sender_id = ?)
      )
      WHERE (fr.status = 'accepted' OR fr.status = 'pending') AND u.id != ?
    `;
    db.query(sql, [userId, userId, userId], callback);
  },

  count(userId, callback) {
    const sql = `
      SELECT COUNT(*) AS friendCount
      FROM friend_requests
      WHERE (sender_id = ? OR receiver_id = ?)
      AND status = 'accepted'
    `;
    db.query(sql, [userId, userId], callback);
  },

  incoming(userId, callback) {
    const sql = `
      SELECT u.id AS sender_id, u.username, u.avatar
      FROM friend_requests fr
      JOIN users u ON u.id = fr.sender_id
      WHERE fr.receiver_id = ? AND fr.status = 'pending'
    `;
    db.query(sql, [userId], callback);
  },

  incomingCount(userId, callback) {
    const sql = `
      SELECT COUNT(*) as count
      FROM friend_requests
      WHERE receiver_id = ? AND status = 'pending'
    `;
    db.query(sql, [userId], callback);
  },

  // Lägg till denna i din FriendRequest-model
  getPeopleYouMayKnow(userId, callback) {
    const sql = `
    SELECT 
      u.id, 
      u.username, 
      u.avatar, 
      COUNT(*) AS mutualCount
    FROM friend_requests fr1
    -- Steg 1: Hitta mina vänner
    JOIN friend_requests fr2 ON (
      (fr2.sender_id = IF(fr1.sender_id = ?, fr1.receiver_id, fr1.sender_id) OR 
       fr2.receiver_id = IF(fr1.sender_id = ?, fr1.receiver_id, fr1.sender_id))
    )
    -- Steg 2: Koppla till User-tabellen för att få profilinfo
    JOIN users u ON (
      u.id = IF(fr2.sender_id = IF(fr1.sender_id = ?, fr1.receiver_id, fr1.sender_id), fr2.receiver_id, fr2.sender_id)
    )
    WHERE (fr1.sender_id = ? OR fr1.receiver_id = ?)
      AND fr1.status = 'accepted'
      AND fr2.status = 'accepted'
      AND u.id != ? -- Inte jag själv
      AND u.id NOT IN (
        -- Steg 3: Exkludera befintliga vänner eller väntande förfrågningar
        SELECT IF(sender_id = ?, receiver_id, sender_id)
        FROM friend_requests
        WHERE (sender_id = ? OR receiver_id = ?)
      )
    GROUP BY u.id
    ORDER BY mutualCount DESC
    LIMIT 12
  `;

    const params = [
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
    ];
    db.query(sql, params, callback);
  },
};
