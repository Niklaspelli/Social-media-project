import { getOverview } from "../../models/overview.model.js";

export const overviewController = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || "desc";
    const subjectId = req.query.subjectId;

    const overview = await getOverview({
      userId,
      limit,
      offset,
      sort,
      subjectId,
    });
    res.json({ ...overview, page, limit });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch overview" });
  }
};
