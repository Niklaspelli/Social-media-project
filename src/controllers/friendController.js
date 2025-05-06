import { db } from "../config/db.js";

export const sendFriendRequest = (req, res) => {
  const senderId = req.user.id; // Logged-in user
  const { receiverId } = req.body;

  // Validate required fields first
  if (!receiverId) {
    return res.status(400).json({ error: "Receiver ID is required." });
  }

  // Prevent sending a friend request to yourself
  if (Number(senderId) === Number(receiverId)) {
    return res
      .status(400)
      .json({ error: "You cannot send a friend request to yourself." });
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

    return res.status(201).json({ message: "Friend request sent!" });
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

// Example route: GET /api/friends/:userId
export const getFriendsList = (req, res) => {
  const loggedInUserId = req.user?.id;

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sql = `
    SELECT 
      u.id, u.username, u.avatar,
      CASE 
        WHEN fr.status = 'accepted' THEN 'friend'
        WHEN fr.status = 'pending' AND fr.receiver_id = ? THEN 'incoming'
        WHEN fr.status = 'pending' AND fr.sender_id = ? THEN 'outgoing'
        ELSE 'none'
      END AS friendship_status
    FROM users u
    LEFT JOIN friend_requests fr ON (
      (fr.sender_id = ? AND fr.receiver_id = u.id)
      OR
      (fr.receiver_id = ? AND fr.sender_id = u.id)
    )
    WHERE u.id != ?
  `;

  db.query(
    sql,
    [
      loggedInUserId,
      loggedInUserId,
      loggedInUserId,
      loggedInUserId,
      loggedInUserId,
    ],
    (err, results) => {
      if (err) {
        console.error("Error fetching friends list:", err.message);
        return res.status(500).json({ error: "Database error." });
      }

      return res.status(200).json(results);
    }
  );
};

export const getFriendCount = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT COUNT(*) AS friendCount
    FROM friend_requests
    WHERE 
      (sender_id = ? OR receiver_id = ?)
      AND status = 'accepted'
  `;

  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error("Error getting friend count:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const friendCount = results[0].friendCount || 0;
    res.json({ numberOfFriends: friendCount });
  });
};
