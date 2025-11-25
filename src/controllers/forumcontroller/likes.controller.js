import { toggleLike, getLikeCount } from "../../models/likes.model.js";

// --------------------------------------------------------
// POST /responses/:responseId/like
// Toggle like/unlike
// --------------------------------------------------------
export const toggleLikeController = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const response_id = req.params.responseId;

    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!response_id) {
      return res.status(400).json({ message: "Response ID required" });
    }

    const liked = await toggleLike(user_id, response_id);
    const likeCount = await getLikeCount(response_id);

    res.json({
      success: true,
      liked,
      likeCount,
    });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------------------------
// GET /responses/:responseId/like-count
// Get total likes for a response
// --------------------------------------------------------
export const getLikeCountController = async (req, res) => {
  try {
    const response_id = req.params.responseId;

    if (!response_id) {
      return res.status(400).json({ message: "Response ID required" });
    }

    const likeCount = await getLikeCount(response_id);

    res.json({
      success: true,
      response_id,
      likeCount,
    });
  } catch (err) {
    console.error("Error fetching like count:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
