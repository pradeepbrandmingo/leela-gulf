import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// GET /api/events & POST /api/events
router.route("/").get(getEvents).post(createEvent);

// GET /api/events/:id & PUT /api/events/:id & DELETE /api/events/:id
router.route("/:id").get(getEventById).put(updateEvent).delete(deleteEvent);

export default router;
