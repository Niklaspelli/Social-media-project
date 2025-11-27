import { getActivity } from "../../models/activity.model.js";

export const getActivityController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = await getActivity(userId);
    res.json(data);
  } catch (err) {
    console.error("Failed to fetch activity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
