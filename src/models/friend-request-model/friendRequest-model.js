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
      SELECT u.id, u.username, u.avatar, u.last_seen
      FROM users u
      JOIN friend_requests fr ON (
        (fr.sender_id = u.id AND fr.receiver_id = ?)
        OR
        (fr.receiver_id = u.id AND fr.sender_id = ?)
      )
      WHERE fr.status = 'accepted'
        AND u.id != ?
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
};
