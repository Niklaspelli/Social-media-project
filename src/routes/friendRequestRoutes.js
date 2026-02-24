import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import { friendController } from "../controllers/friend-request-controller.js";

const router = express.Router();

router.post(
  "/send",
  authenticateJWT,
  verifyCsrfToken,
  friendController.sendFriendRequest,
);
router.put(
  "/accept",
  authenticateJWT,
  verifyCsrfToken,
  friendController.acceptFriendRequest,
);
router.put(
  "/reject",
  authenticateJWT,
  verifyCsrfToken,
  friendController.rejectFriendRequest,
);
router.put(
  "/unfollow",
  authenticateJWT,
  verifyCsrfToken,
  friendController.unfollow,
);

router.put(
  "/last-seen",
  authenticateJWT,
  verifyCsrfToken,
  friendController.updateLastSeen,
);

router.get("/list/:id", authenticateJWT, friendController.getFriends);
router.get("/count/:userId", friendController.getFriendCount);
router.get("/suggestions", authenticateJWT, friendController.getSuggestions);

router.get("/incoming", authenticateJWT, friendController.getIncoming);
router.get(
  "/incoming/count",
  authenticateJWT,
  friendController.getIncomingCount,
);

export default router;
