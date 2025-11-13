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
} from "../controllers/eventController.js";

const router = express.Router();

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
router.get("/user", authenticateJWT, getUserEvents);
router.get("/events/invitations", authenticateJWT, getIncomingEventInvitations);
router.get(
  "/events/invitations/count",
  authenticateJWT,
  getIncomingEventInvitationCount
);

router.put("/events/:id", authenticateJWT, verifyCsrfToken, updateEvent);
export default router;
