import {
  createResponse,
  getResponsesByThreadId,
  deleteResponseById,
} from "../../models/response.model.js";

// --------------------------------------------------------
// POST /responses/:threadId
// --------------------------------------------------------
export const postResponseController = async (req, res) => {
  try {
    const thread_id = req.params.threadId;
    const user_id = req.user?.id;
    const { body } = req.body;

    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!body || !thread_id) {
      return res.status(400).json({ message: "Body and thread ID required" });
    }

    const responseId = await createResponse({ thread_id, body, user_id });

    res.status(201).json({
      success: true,
      message: "Response posted",
      responseId,
    });
  } catch (err) {
    console.error("Error posting response:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------------------------
// GET /responses/:threadId
// --------------------------------------------------------
export const getResponsesByThreadController = async (req, res) => {
  try {
    const thread_id = req.params.threadId;

    const responses = await getResponsesByThreadId(thread_id);

    res.json({
      success: true,
      thread_id,
      responses,
    });
  } catch (err) {
    console.error("Error fetching responses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------------------------
// DELETE /responses/:responseId
// --------------------------------------------------------
export const deleteResponseController = async (req, res) => {
  try {
    const responseId = req.params.responseId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await deleteResponseById(responseId, userId);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Response not found or not allowed" });
    }

    res.json({
      success: true,
      message: "Response deleted",
    });
  } catch (err) {
    console.error("Error deleting response:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
