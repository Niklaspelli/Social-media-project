import {
  createEvent,
  getUserCreatedEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../../models/event-model/event.model.js";

// Skapa nytt event
export const createEventController = async (req, res) => {
  try {
    const { title, description, datetime, location, event_image } = req.body;
    const creator_id = req.user.id;

    if (!title || !datetime || !location) {
      return res
        .status(400)
        .json({ error: "Title, datetime och location krävs!" });
    }

    const eventId = await createEvent({
      creator_id,
      title,
      description,
      datetime,
      location,
      event_image,
    });

    res.status(201).json({ message: "Event skapades!", eventId });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Internt serverfel vid eventskapande" });
  }
};

// Hämta alla events skapade av användaren
export const getUserEventsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await getUserCreatedEvents(userId);
    res.json(events);
  } catch (err) {
    console.error("Error fetching user events:", err);
    res.status(500).json({ error: "Internt serverfel" });
  }
};

// Hämta ett event via ID
export const getEventController = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    if (!event) return res.status(404).json({ error: "Event hittades inte" });

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Internt serverfel" });
  }
};

// Uppdatera ett event
export const updateEventController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, datetime, location } = req.body;

    const affectedRows = await updateEvent({
      eventId: id,
      title,
      description,
      datetime,
      location,
    });
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Event hittades inte eller ingen ändring gjord" });
    }

    res.json({ message: "Event uppdaterat" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Internt serverfel vid uppdatering" });
  }
};

// Ta bort ett event
export const deleteEventController = async (req, res) => {
  try {
    const { id } = req.params;

    const affectedRows = await deleteEvent(id);
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Event hittades inte eller ej behörighet" });
    }

    res.json({ message: "Event borttaget" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Internt serverfel vid borttagning" });
  }
};
