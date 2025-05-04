import { db } from "../config/db.js";

export const sendFriendRequest = (req, res) => {
  const senderId = req.user.id; // Logged-in user
  const { receiverId } = req.body; // Target user

  if (!receiverId) {
    return res.status(400).json({ error: "Receiver ID is required." });
  }

  const sql = `
    INSERT INTO friend_requests (sender_id, receiver_id, status)
    VALUES (?, ?, 'pending')
  `;

  db.query(sql, [senderId, receiverId], (err, result) => {
    if (err) {
      console.error("Error sending friend request:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(201).json({ message: "Friend request sent!" });
  });
};

// Accept a friend request
export const acceptFriendRequest = (req, res) => {
  const receiverId = req.user.id; // Logged-in user (the one accepting)
  const { senderId } = req.body; // Comes from frontend (the user who sent the request)

  const sql = `
    UPDATE friend_requests
    SET status = 'accepted'
    WHERE sender_id = ? AND receiver_id = ?
  `;

  db.query(sql, [senderId, receiverId], (err, result) => {
    if (err) {
      console.error("Error accepting friend request:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No pending request found" });
    }

    return res.status(200).json({ message: "Friend request accepted." });
  });
};

// Reject a friend request
export const rejectFriendRequest = (req, res) => {
  const receiverId = req.user.id; // Logged-in user (the one rejecting)
  const { senderId } = req.body; // Comes from frontend (the user who sent the request)

  if (!senderId) {
    return res.status(400).json({ error: "Sender ID is required" });
  }

  const sql = `
    UPDATE friend_requests
    SET status = 'rejected'
    WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
  `;

  db.query(sql, [senderId, receiverId], (err, result) => {
    if (err) {
      console.error("Error rejecting friend request:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No pending request found" });
    }

    return res.status(200).json({ message: "Friend request rejected." });
  });
};

export const getFriendshipStatus = (req, res) => {
  const { userId1, userId2 } = req.params;

  const sql = `
    SELECT sender_id, receiver_id, status
    FROM friend_requests
    WHERE 
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
    LIMIT 1
  `;

  db.query(sql, [userId1, userId2, userId2, userId1], (err, results) => {
    if (err) {
      console.error("Error checking friendship status:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.json({
        isFriend: false,
        isPending: false,
        incomingRequest: false,
      });
    }

    const request = results[0];
    const isFriend = request.status === "accepted";
    const isPending = request.status === "pending";
    const incomingRequest =
      request.status === "pending" && request.receiver_id == userId1;

    return res.json({ isFriend, isPending, incomingRequest });
  });
};
