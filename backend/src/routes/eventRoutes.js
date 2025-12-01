import express from "express";
import * as eventController from "../controller/eventController.js";
import { authenticateToken, isPromoter } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Promoter-only routes
router.post("/", authenticateToken, isPromoter, eventController.createEvent);
router.put("/:id", authenticateToken, isPromoter, eventController.updateEvent);
router.delete("/:id", authenticateToken, isPromoter, eventController.deleteEvent);

// Ticket management routes (for promoters)
router.get("/:eventId/tickets", eventController.getEventTickets);
router.post("/:eventId/tickets", authenticateToken, isPromoter, eventController.addTicketToEvent);
router.put("/tickets/:ticketId", authenticateToken, isPromoter, eventController.updateTicket);
router.delete("/tickets/:ticketId", authenticateToken, isPromoter, eventController.deleteTicket);

export default router;