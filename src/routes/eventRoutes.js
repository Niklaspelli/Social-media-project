import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware.js";
import { verifyCsrfToken } from "../middleware/csrf.js";

import {
  createEventController,
  getUserEventsController,
  getEventController,
  updateEventController,
  deleteEventController,
} from "../controllers/eventcontroller/create-event.controller.js";

const router = express.Router();

// Skapa nytt event (protected)
router.post("/", authenticateJWT, verifyCsrfToken, createEventController);

// Hämta alla events för inloggad användare (protected)
router.get("/", authenticateJWT, getUserEventsController);

// Hämta ett specifikt event via ID (protected)
router.get("/:id", authenticateJWT, getEventController);

// Uppdatera ett event (protected)
router.put("/:id", authenticateJWT, verifyCsrfToken, updateEventController);

// Ta bort ett event (protected)
router.delete("/:id", authenticateJWT, verifyCsrfToken, deleteEventController);

export default router;
