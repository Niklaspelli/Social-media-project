/* import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";

import {
  createFeedPost,
  getUserFeedPosts,
  getFullFeed,
  deleteFeedPost,
  getFriendFeed,
} from "../controllers/userFeedController.js";

import {
  getCompleteUserProfile,
  getUserById,
  getOtherUserProfile,
  searchUser,
} from "../controllers/userController.js";

import {
  registerUser,
  loginUser,
  getCsrfToken,
  deleteUser,
  updateAvatar,
} from "../controllers/authController.js";

import {
  createThread,
  getAllThreads,
  getThreadWithResponses,
  postResponseToThread,
  deleteResponse,
  likeResponse,
  unlikeResponse,
  getLikeCountForResponse,
  getSubjects,
} from "../controllers/forumController.js";

import {
  createOrUpdateUserProfile,
  updateUserProfile,
  getUserProfile,
} from "../controllers/userProfileController.js";

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
} from "../controllers/friendController.js";

import {
  createEvent,
  getAllEvents,
  getIncomingEventInvitations,
  getIncomingEventInvitationCount,
  acceptEventInvitation,
  rejectEventInvitation,
  getEventById,
  getUserEvents,
  getEventInvitees,
} from "../controllers/eventController.js";

import {
  createEventFeedPost,
  getEventFeedPosts,
  deleteEventFeedPost,
} from "../controllers/eventFeedController.js";

const router = express.Router();

router.get("/csrf-token", getCsrfToken); // ⬅️ Add this line

// Optional test route
router.get("/test", (req, res) => {
  res.send("Forum routes are working!");
});
console.log("forumRoutes.js loaded");

// 🛡️ Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/users/:userId", authenticateJWT, verifyCsrfToken, deleteUser);
router.put("/users/avatar", authenticateJWT, verifyCsrfToken, updateAvatar);

// 👤 User Profile routes
router.get(
  "/profile",
  authenticateJWT,
  verifyCsrfToken,
  getCompleteUserProfile
);
router.get("/users/:id", authenticateJWT, verifyCsrfToken, getOtherUserProfile);
router.get(
  "/search/users/:username",
  authenticateJWT,
  verifyCsrfToken,
  searchUser
);
router.get("/profile/:userId", authenticateJWT, verifyCsrfToken, getUserById);

router.get("/users/:userId", authenticateJWT, getUserProfile);
router.post("/users", authenticateJWT, createOrUpdateUserProfile);
router.put("/users", authenticateJWT, updateUserProfile);

// 📝 Forum routes
router.get("/threads", getAllThreads); // Public
router.get("/threads/:threadId", getThreadWithResponses); // Public
router.post("/threads", authenticateJWT, verifyCsrfToken, createThread); // Protected
router.post(
  "/threads/:threadId/responses",
  authenticateJWT,
  verifyCsrfToken,
  postResponseToThread
);
router.get("/subjects", getSubjects); // Public

//response routes
router.delete("/responses/:responseId", authenticateJWT, deleteResponse); // Protected

router.post(
  "/responses/:responseId/like", // Use :responseId to make it dynamic
  authenticateJWT,
  verifyCsrfToken,
  likeResponse
);

router.delete(
  "/responses/:responseId/like", // Use :responseId to make it dynamic
  authenticateJWT,
  verifyCsrfToken,
  unlikeResponse
);
router.get("/responses/:responseId/like-count", getLikeCountForResponse);

router.post(
  "/friend-request",
  authenticateJWT,
  verifyCsrfToken,
  sendFriendRequest
);
router.post("/accept", authenticateJWT, verifyCsrfToken, acceptFriendRequest);
router.post("/reject", authenticateJWT, verifyCsrfToken, rejectFriendRequest);
router.get("/status/:senderId/:receiverId", getFriendshipStatus);
router.get("/friends/:userId", authenticateJWT, getFriendsList);
router.get("/friends/count/:userId", authenticateJWT, getFriendCount);
router.get("/received-requests", authenticateJWT, getIncomingFriendRequests);
router.put("/unfollow", authenticateJWT, unfollowFriend);
router.put("/update-last-seen", authenticateJWT, updateLastSeen);
router.get(
  "/friends/notifications/:userId",
  authenticateJWT,
  getIncomingFriendRequestCount
);
router.post("/feed-post", authenticateJWT, verifyCsrfToken, createFeedPost);
router.get("/friends-feed/", authenticateJWT, getFriendFeed);
router.get("/feed-post/feed/:userId", authenticateJWT, getFullFeed);
router.get("/feed-post/user/:userId", authenticateJWT, getUserFeedPosts);

router.delete(
  "/feed-post/:postId",
  authenticateJWT,
  verifyCsrfToken,
  deleteFeedPost
);

//feed

router.get("/friends-feed/", authenticateJWT, getFriendFeed);
router.get("/feed-post/feed/:userId", authenticateJWT, getFullFeed);
router.get("/feed-post/user/:userId", authenticateJWT, getUserFeedPosts);

//events
router.post("/events", authenticateJWT, verifyCsrfToken, createEvent); // Protected
router.get("/events", authenticateJWT, getAllEvents);
router.get("/events/user", authenticateJWT, getUserEvents);

router.get("/events/invitations", authenticateJWT, getIncomingEventInvitations);
router.get(
  "/events/invitations/count",
  authenticateJWT,
  getIncomingEventInvitationCount
);
router.post(
  "/events/invitations/accept",
  authenticateJWT,
  verifyCsrfToken,
  acceptEventInvitation
);
router.post(
  "/events/invitations/reject",
  authenticateJWT,
  verifyCsrfToken,
  rejectEventInvitation
);
router.get("/events/:id", authenticateJWT, getEventById);
router.get("/events/:id/invitees", authenticateJWT, getEventInvitees);

router.post(
  "/events/:eventId/feed",
  authenticateJWT,
  verifyCsrfToken,
  createEventFeedPost
);

router.get("/events/:eventId/feed", authenticateJWT, getEventFeedPosts);
router.delete(
  "/event-feed-post/:postId",
  authenticateJWT,
  verifyCsrfToken,
  deleteEventFeedPost
);

export default router;
 */
