import { getOverview } from "../../models/overview.model.js";

export const overviewController = (req, res) => {
  const userId = req.user?.id || 0; // om inte inloggad
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  getOverview(userId, limit, offset, (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }

    res.json({
      success: true,
      page,
      limit,
      ...data,
    });
  });
};
