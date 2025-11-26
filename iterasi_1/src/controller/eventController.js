import { pool } from "../config/database.js";

// Helper untuk response uniform
const ok = (res, message, data = null, status = 200) =>
  res.status(status).json({ success: true, message, data });

const fail = (res, message, status = 400, data = null) =>
  res.status(status).json({ success: false, message, data });

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
    return ok(res, "Events fetched", result.rows);
  } catch (error) {
    return fail(res, "Failed to fetch events", 500, { error: error.message });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return fail(res, "Event not found", 404);
    }
    return ok(res, "Event fetched", result.rows[0]);
  } catch (error) {
    return fail(res, "Failed to fetch event", 500, { error: error.message });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, poster_url } = req.body;

    if (!title || !date) {
      return fail(res, "title and date are required", 400);
    }

    const promoter_id = req.user.id;

    const result = await pool.query(
      "INSERT INTO events (title, description, date, location, poster_url, promoter_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description ?? null, date, location ?? null, poster_url ?? null, promoter_id]
    );

    return ok(res, "Event created", result.rows[0], 201);
  } catch (error) {
    return fail(res, "Failed to create event", 500, { error: error.message });
  }
};

// Update an event (partial update with COALESCE)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, poster_url } = req.body;
    const promoter_id = req.user.id;

    const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    if (eventResult.rows.length === 0) {
      return fail(res, "Event not found", 404);
    }

    if (eventResult.rows[0].promoter_id !== promoter_id) {
      return fail(res, "Forbidden: you are not the promoter of this event", 403);
    }

    const result = await pool.query(
      `UPDATE events
       SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         date = COALESCE($3, date),
         location = COALESCE($4, location),
         poster_url = COALESCE($5, poster_url)
       WHERE id = $6
       RETURNING *`,
      [title ?? null, description ?? null, date ?? null, location ?? null, poster_url ?? null, id]
    );

    return ok(res, "Event updated", result.rows[0]);
  } catch (error) {
    return fail(res, "Failed to update event", 500, { error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const promoter_id = req.user.id;

    const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
    if (eventResult.rows.length === 0) {
      return fail(res, "Event not found", 404);
    }

    if (eventResult.rows[0].promoter_id !== promoter_id) {
      return fail(res, "Forbidden: you are not the promoter of this event", 403);
    }

    await pool.query("DELETE FROM events WHERE id = $1", [id]);
    return ok(res, "Event deleted", null, 200);
  } catch (error) {
    return fail(res, "Failed to delete event", 500, { error: error.message });
  }
};

//--- Ticket Management ---

// Get tickets for an event
const getEventTickets = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query("SELECT * FROM tickets WHERE event_id = $1", [eventId]);
    return ok(res, "Tickets fetched", result.rows);
  } catch (error) {
    return fail(res, "Failed to fetch tickets", 500, { error: error.message });
  }
};

// Add a ticket to an event
const addTicketToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { type, price, quantity, sale_start_date, sale_end_date } = req.body;
    const promoter_id = req.user.id;

    if (!type || price == null || quantity == null) {
      return fail(res, "type, price, and quantity are required", 400);
    }

    const eventResult = await pool.query("SELECT promoter_id FROM events WHERE id = $1", [eventId]);
    if (eventResult.rows.length === 0) {
      return fail(res, "Event not found", 404);
    }
    if (eventResult.rows[0].promoter_id !== promoter_id) {
      return fail(res, "Forbidden: you are not the promoter of this event", 403);
    }

    const result = await pool.query(
      "INSERT INTO tickets (event_id, type, price, quantity, sale_start_date, sale_end_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        eventId,
        type,
        price,
        quantity,
        sale_start_date ?? null,
        sale_end_date ?? null,
      ]
    );

    return ok(res, "Ticket created", result.rows[0], 201);
  } catch (error) {
    return fail(res, "Failed to create ticket", 500, { error: error.message });
  }
};

// Update a ticket (partial update with COALESCE)
const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { type, price, quantity, sale_start_date, sale_end_date } = req.body;
    const promoter_id = req.user.id;

    const ticketResult = await pool.query(
      "SELECT t.*, e.promoter_id FROM tickets t JOIN events e ON t.event_id = e.id WHERE t.id = $1",
      [ticketId]
    );
    if (ticketResult.rows.length === 0) {
      return fail(res, "Ticket not found", 404);
    }
    if (ticketResult.rows[0].promoter_id !== promoter_id) {
      return fail(res, "Forbidden: you are not the promoter of this event", 403);
    }

    const result = await pool.query(
      `UPDATE tickets
       SET
         type = COALESCE($1, type),
         price = COALESCE($2, price),
         quantity = COALESCE($3, quantity),
         sale_start_date = COALESCE($4, sale_start_date),
         sale_end_date = COALESCE($5, sale_end_date)
       WHERE id = $6
       RETURNING *`,
      [
        type ?? null,
        price ?? null,
        quantity ?? null,
        sale_start_date ?? null,
        sale_end_date ?? null,
        ticketId,
      ]
    );

    return ok(res, "Ticket updated", result.rows[0]);
  } catch (error) {
    return fail(res, "Failed to update ticket", 500, { error: error.message });
  }
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const promoter_id = req.user.id;

    const ticketResult = await pool.query(
      "SELECT t.*, e.promoter_id FROM tickets t JOIN events e ON t.event_id = e.id WHERE t.id = $1",
      [ticketId]
    );
    if (ticketResult.rows.length === 0) {
      return fail(res, "Ticket not found", 404);
    }
    if (ticketResult.rows[0].promoter_id !== promoter_id) {
      return fail(res, "Forbidden: you are not the promoter of this event", 403);
    }

    await pool.query("DELETE FROM tickets WHERE id = $1", [ticketId]);
    return ok(res, "Ticket deleted", null, 200);
  } catch (error) {
    return fail(res, "Failed to delete ticket", 500, { error: error.message });
  }
};

export {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventTickets,
  addTicketToEvent,
  updateTicket,
  deleteTicket,
};