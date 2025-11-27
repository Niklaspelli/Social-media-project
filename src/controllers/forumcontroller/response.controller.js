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
    const threadId = req.params.threadId;
    const userId = req.user?.id;
    const { body } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!body)
      return res
        .status(400)
        .json({ success: false, message: "Response body is required" });

    const responseId = await createResponse({
      thread_id: threadId,
      body,
      user_id: userId,
    });

    res.status(201).json({
      success: true,
      message: "Response posted successfully",
      data: { responseId, threadId, body, userId },
    });
  } catch (err) {
    console.error("Error posting response:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// --------------------------------------------------------
// GET /responses/:threadId
// --------------------------------------------------------
export const getResponsesByThreadController = async (req, res) => {
  const thread_id = req.params.threadId;
  const user_id = req.user?.id || 0;

  try {
    const responses = await getResponsesByThreadId(thread_id, user_id);
    res.json({ success: true, thread_id, responses });
  } catch (err) {
    console.error(err);
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

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const deleted = await deleteResponseById(responseId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message:
          "Response not found or you do not have permission to delete it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Response deleted successfully",
      responseId,
    });
  } catch (err) {
    console.error("Error deleting response:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
