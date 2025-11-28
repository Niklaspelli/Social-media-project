import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { getEventInvitees } from "../controllers/eventcontroller/event-invitee.controller.js";

const router = express.Router();

router.get("/:id/invitees", authenticateJWT, getEventInvitees);

export default router;
