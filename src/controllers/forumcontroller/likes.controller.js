import {
  toggleLike,
  getLikeCount,
  userHasLiked,
} from "../../models/likes.model.js";

// Toggle like/unlike
export const toggleLikeController = async (req, res) => {
  const user_id = req.user?.id;
  const { responseId } = req.params;

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!responseId) {
    return res.status(400).json({ error: "Missing responseId" });
  }

  try {
    // Toggle like
    const result = await toggleLike(user_id, responseId);

    // Fetch updated like count
    const likeCount = await getLikeCount(responseId);

    res.json({
      liked: result.liked,
      likeCount,
    });
  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

// Get total like count
export const getLikeCountController = async (req, res) => {
  const { responseId } = req.params;

  if (!responseId) {
    return res.status(400).json({ error: "Missing responseId" });
  }

  try {
    const likeCount = await getLikeCount(responseId);

    const user_id = req.user?.id;
    const userLiked = user_id ? await userHasLiked(user_id, responseId) : false;

    res.json({
      responseId,
      likeCount,
      userLiked,
    });
  } catch (err) {
    console.error("Like count error:", err);
    res.status(500).json({ error: "Failed to fetch like count" });
  }
};
