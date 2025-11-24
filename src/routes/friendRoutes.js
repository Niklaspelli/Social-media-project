import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getIncomingFriendRequests,
  getIncomingFriendRequestCount,
  getFriendshipStatus,
  getFriendsList,
  getFriendCount,
  unfollowFriend,
  updateLastSeen,
  getMutualFriends,
  getPeopleYouMayKnow,
} from "../controllers/friendController.js";

const router = express.Router();

router.post(
  "/friend-request",
  authenticateJWT,
  verifyCsrfToken,
  sendFriendRequest
);
router.post("/accept", authenticateJWT, verifyCsrfToken, acceptFriendRequest);
router.post("/reject", authenticateJWT, verifyCsrfToken, rejectFriendRequest);
router.get(
  "/status/:senderId/:receiverId",
  authenticateJWT,
  getFriendshipStatus
);
router.get("/friends/:userId", authenticateJWT, getFriendsList);
router.get("/friends/count/:userId", authenticateJWT, getFriendCount);
router.get("/received-requests", authenticateJWT, getIncomingFriendRequests);
router.put("/unfollow", authenticateJWT, verifyCsrfToken, unfollowFriend);
router.put(
  "/update-last-seen",
  authenticateJWT,
  verifyCsrfToken,
  updateLastSeen
);
router.get(
  "/friends/notifications/:userId",
  authenticateJWT,
  getIncomingFriendRequestCount
);
router.get(
  "/mutual-friends/:userId1/:userId2",
  authenticateJWT,
  getMutualFriends
);

router.get("/people-you-may-know", authenticateJWT, getPeopleYouMayKnow);

export default router;
