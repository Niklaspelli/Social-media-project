/* import { FriendRequest } from "../../models/friend-request-model/friendRequest-model.js"; */
import { FriendRequest } from "../models/friend-request-model/friendRequest-model.js";

import { User } from "../models/friend-request-model/lastSeen-model.js";

export const friendController = {
  sendFriendRequest(req, res) {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required." });
    }

    if (senderId == receiverId) {
      return res.status(400).json({ error: "Can't friend yourself." });
    }

    FriendRequest.findRelation(senderId, receiverId, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        const status = results[0].status;

        if (status === "pending")
          return res.status(400).json({ error: "Request already pending." });

        if (status === "accepted")
          return res.status(400).json({ error: "Already friends." });
      }

      FriendRequest.create(senderId, receiverId, (err2) => {
        if (err2) return res.status(500).json({ error: "Database error" });

        return res.status(201).json({ message: "Friend request sent!" });
      });
    });
  },

  acceptFriendRequest(req, res) {
    const receiverId = req.user.id;
    const { senderId } = req.body;

    FriendRequest.accept(senderId, receiverId, (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "No pending request found" });

      res.json({ message: "Friend request accepted." });
    });
  },

  rejectFriendRequest(req, res) {
    const receiverId = req.user.id;
    const { senderId } = req.body;

    FriendRequest.reject(senderId, receiverId, (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0)
        return res.status(400).json({ error: "No pending request found." });

      res.json({ message: "Friend request rejected." });
    });
  },

  getFriends(req, res) {
    FriendRequest.getFriends(req.user.id, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json(results);
    });
  },

  getFriendCount(req, res) {
    FriendRequest.count(req.params.userId, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ numberOfFriends: results[0].friendCount });
    });
  },

  getIncoming(req, res) {
    FriendRequest.incoming(req.user.id, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json(results);
    });
  },

  getIncomingCount(req, res) {
    FriendRequest.incomingCount(req.user.id, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      res.json({ count: results[0].count });
    });
  },

  unfollow(req, res) {
    const { senderId, receiverId } = req.body;

    FriendRequest.delete(senderId, receiverId, (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (result.affectedRows === 0)
        return res.status(404).json({ error: "No friendship found" });

      res.json({ message: "Friendship removed." });
    });
  },

  updateLastSeen(req, res) {
    User.updateLastSeen(req.user.id, (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.sendStatus(200);
    });
  },
};
