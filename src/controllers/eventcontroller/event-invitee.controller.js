import { getInviteesByEventId } from "../../models/event-model/event-Invitee.model.js";

export const getEventInvitees = async (req, res) => {
  const eventId = req.params.id;

  try {
    const invitees = await getInviteesByEventId(eventId);
    res.status(200).json(invitees);
  } catch (err) {
    console.error("Error fetching invitees:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
