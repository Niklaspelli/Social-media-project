import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";
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
  deleteEvent,
  updateEvent,
  getEventOverview,
} from "../controllers/eventController.js";

const router = express.Router();

/* NY EVENT ROUTE
 */

router.get("/:eventId/overview", authenticateJWT, getEventOverview);

//events
router.post("/events", authenticateJWT, verifyCsrfToken, createEvent); // Protected
router.post(
  "/invitations/accept",
  authenticateJWT,
  verifyCsrfToken,
  acceptEventInvitation
);
router.post(
  "/invitations/reject",
  authenticateJWT,
  verifyCsrfToken,
  rejectEventInvitation
);
router.delete("/:id", authenticateJWT, verifyCsrfToken, deleteEvent);

router.get("/events/:id", authenticateJWT, getEventById);
router.get("/events/:id/invitees", authenticateJWT, getEventInvitees);
router.get("/events", authenticateJWT, getAllEvents);
router.get("/user-events", authenticateJWT, getUserEvents);
router.get("/invitations", authenticateJWT, getIncomingEventInvitations);
router.get(
  "/invitations/count",
  authenticateJWT,
  getIncomingEventInvitationCount
);

router.put("/events/:id", authenticateJWT, verifyCsrfToken, updateEvent);
export default router;
