import {
  getEventById,
  getEventInvitees,
  getEventFeedPosts,
  getEventFeedCount,
} from "../../models/event-model/event-overview.model.js";

export const getEventOverviewController = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const feedLimit = parseInt(req.query.feedLimit) || 10;
    const feedOffset = parseInt(req.query.feedOffset) || 0;

    const event = await getEventById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const [invitees, feedPosts, totalFeedPosts] = await Promise.all([
      getEventInvitees(eventId),
      getEventFeedPosts(eventId, feedLimit, feedOffset),
      getEventFeedCount(eventId),
    ]);

    res.status(200).json({
      event,
      invitees,
      feed: {
        posts: feedPosts,
        total: totalFeedPosts,
        limit: feedLimit,
        offset: feedOffset,
      },
    });
  } catch (err) {
    console.error("Error fetching event overview:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
