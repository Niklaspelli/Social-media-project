import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";

import {
  getIncomingEventInvitations,
  getIncomingEventInvitationCountController,
  acceptEventInvitation,
  rejectEventInvitation,
} from "../controllers/eventcontroller/event-invitation.controller.js";

const router = express.Router();

// GET pending event invites
router.get("/incoming", authenticateJWT, getIncomingEventInvitations);

// GET count
router.get(
  "/incoming/count",
  authenticateJWT,
  getIncomingEventInvitationCountController
);

// POST accept
router.post("/accept", authenticateJWT, verifyCsrfToken, acceptEventInvitation);

// POST reject
router.post("/reject", authenticateJWT, verifyCsrfToken, rejectEventInvitation);

export default router;
