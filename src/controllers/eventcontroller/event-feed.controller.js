import * as EventFeedModel from "../../models/event-model/event-feed.model.js";

export const getEventFeedController = async (req, res) => {
  const eventId = Number(req.params.eventId);
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;

  try {
    const posts = await EventFeedModel.getEventFeedPosts(
      eventId,
      limit,
      offset
    );
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch event feed posts" });
  }
};

export const createEventFeedController = async (req, res) => {
  const eventId = Number(req.params.eventId);
  const userId = req.user.id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const post = await EventFeedModel.createEventFeedPost(
      userId,
      eventId,
      content
    );
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create feed post" });
  }
};

export const deleteEventFeedController = async (req, res) => {
  const userId = req.user.id;
  const postId = Number(req.params.postId);

  try {
    const affectedRows = await EventFeedModel.deleteEventFeedPost(
      userId,
      postId
    );
    if (!affectedRows)
      return res.status(403).json({ error: "Unauthorized or post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete feed post" });
  }
};
