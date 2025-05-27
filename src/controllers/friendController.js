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
    WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
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
    WHERE sender_id = ? AND receiver_id = ? 
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
  const { senderId, receiverId } = req.params;
  console.log("Raw params:", req.params);

  if (isNaN(senderId) || isNaN(receiverId)) {
    return res.status(400).json({ error: "Invalid senderId or receiverId" });
  }

  const sId = parseInt(senderId, 10);
  const rId = parseInt(receiverId, 10);

  const sql = `
    SELECT sender_id, receiver_id, status
    FROM friend_requests
    WHERE 
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
    LIMIT 1
  `;

  console.log("Querying with:", [sId, rId, rId, sId]);

  db.query(sql, [sId, rId, rId, sId], (err, results) => {
    if (err) {
      console.error("Error fetching friendship status:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Results from DB:", results);

    if (results.length === 0) {
      return res.status(200).json({ status: "none", incomingRequest: false });
    }

    const request = results[0];
    const status = request.status;
    const incomingRequest = request.sender_id === rId;

    return res.status(200).json({ status, incomingRequest });
  });
};

// PUT /api/auth/unfollow
export const unfollowFriend = (req, res) => {
  const { senderId, receiverId } = req.body; // Assuming these are passed in the request body

  const sql = `
    UPDATE friend_requests
    SET status = 'none'  -- Or 'unfollowed', depending on your schema
    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
  `;

  db.query(
    sql,
    [senderId, receiverId, receiverId, senderId],
    (err, results) => {
      if (err) {
        console.error("Error ending friendship:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      return res
        .status(200)
        .json({ message: "Friendship ended successfully." });
    }
  );
};

export const getFriendsList = (req, res) => {
  const loggedInUserId = req.user?.id;

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sql = `
    SELECT 
      u.id, u.username, u.avatar, u.last_seen
    FROM users u
    JOIN friend_requests fr ON (
      (fr.sender_id = u.id AND fr.receiver_id = ?) OR
      (fr.receiver_id = u.id AND fr.sender_id = ?)
    )
    WHERE fr.status = 'accepted' AND u.id != ?
  `;

  db.query(
    sql,
    [loggedInUserId, loggedInUserId, loggedInUserId],
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

export const getIncomingFriendRequests = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      u.id AS sender_id, 
      u.username, 
      u.avatar
    FROM friend_requests fr
    JOIN users u ON u.id = fr.sender_id
    WHERE fr.receiver_id = ? AND fr.status = 'pending'
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching incoming friend requests:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json(results); // now includes username and avatar
  });
};

export const updateLastSeen = (req, res) => {
  const userId = req.user.id;

  const sql = `UPDATE users SET last_seen = NOW() WHERE id = ?`;
  db.query(sql, [userId], (err) => {
    if (err) {
      console.error("Error updating last_seen:", err);
      return res.status(500).json({ error: "Failed to update last seen" });
    }

    res.sendStatus(200);
  });
};

export const getIncomingFriendRequestCount = async (req, res) => {
  const receiverId = req.user.id;

  db.query(
    "SELECT COUNT(*) as count FROM friend_requests WHERE receiver_id = ? AND status = 'pending'",
    [receiverId],
    (error, results) => {
      if (error) {
        console.error("Error fetching friend request count:", error);
        return res.status(500).json({ error: "Database error" });
      }

      const count = results[0].count;
      res.json({ count });
    }
  );
};
