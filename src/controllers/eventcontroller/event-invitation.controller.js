import {
  getPendingInvitationsByUser,
  getPendingInvitationCount,
  acceptEventInvitationDB,
  rejectEventInvitationDB,
} from "../../models/event-model/event-invitation.model.js";

// GET pending invitations
export const getIncomingEventInvitations = async (req, res) => {
  try {
    const userId = req.user.id;
    const invitations = await getPendingInvitationsByUser(userId);
    res.status(200).json(invitations);
  } catch (err) {
    console.error("Error fetching invitations:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET count of pending invitations
export const getIncomingEventInvitationCountController = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await getPendingInvitationCount(userId);
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching invitation count:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST accept
export const acceptEventInvitation = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  try {
    const result = await acceptEventInvitationDB(eventId, userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No pending invitation found" });
    }

    res.status(200).json({ message: "Invitation accepted" });
  } catch (err) {
    console.error("Error accepting invitation:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST reject
export const rejectEventInvitation = async (req, res) => {
  const userId = req.user.id;
  const { eventId } = req.body;

  try {
    const result = await rejectEventInvitationDB(eventId, userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No pending invitation found" });
    }

    res.status(200).json({ message: "Invitation rejected" });
  } catch (err) {
    console.error("Error rejecting invitation:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
