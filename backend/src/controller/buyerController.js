import { pool } from "../config/database.js";

// Helper untuk response uniform
const ok = (res, message, data = null, status = 200) =>
  res.status(status).json({ success: true, message, data });

const fail = (res, message, status = 400, data = null) =>
  res.status(status).json({ success: false, message, data });

// --- TICKETS ORDERING ---

// Buyer order tickets
const createOrder = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return fail(res, "Unauthorized", 401);
  }

  const { total_price, payment_method, items } = req.body;

  // Validasi basic payload
  if (!Array.isArray(items) || items.length === 0) {
    return fail(res, "items is required and must be a non-empty array", 400);
  }

  if (!payment_method) {
    return fail(res, "payment_method is required", 400);
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let calculatedTotal = 0;
    const itemsToInsert = [];

    // Validasi setiap item terhadap tabel tickets & stok
    for (const [index, item] of items.entries()) {
      const { event_id, ticket_type, quantity } = item || {};

      if (!event_id || !ticket_type || quantity == null) {
        await client.query("ROLLBACK");
        return fail(
          res,
          `Invalid item at index ${index}: event_id, ticket_type, quantity are required`,
          400
        );
      }

      const qty = Number(quantity);
      if (!Number.isFinite(qty) || qty <= 0) {
        await client.query("ROLLBACK");
        return fail(
          res,
          `Invalid quantity at index ${index}: must be positive number`,
          400
        );
      }

      // Lock row ticket terkait
      const ticketResult = await client.query(
        `SELECT id, event_id, type, price, quantity
         FROM tickets
         WHERE event_id = $1 AND type = $2
         FOR UPDATE`,
        [event_id, ticket_type]
      );

      if (ticketResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return fail(
          res,
          `Ticket not found for event_id=${event_id}, type=${ticket_type}`,
          404
        );
      }

      const ticketRow = ticketResult.rows[0];

      if (ticketRow.quantity < qty) {
        await client.query("ROLLBACK");
        return fail(
          res,
          `Insufficient ticket quantity for type=${ticket_type}. Available=${ticketRow.quantity}, requested=${qty}`,
          400
        );
      }

      const priceFromDb = Number(ticketRow.price) || 0;
      const lineTotal = priceFromDb * qty;
      calculatedTotal += lineTotal;

      itemsToInsert.push({
        ticketId: ticketRow.id,
        event_id: ticketRow.event_id,
        ticket_type: ticketRow.type,
        ticket_price: priceFromDb,
        quantity: qty,
      });
    }

    // total dari server (kalau mau tambah admin fee, tambahkan di sini)
    const serverTotal = calculatedTotal;

    // Optional: cross-check dengan total dari client
    if (total_price != null && Number(total_price) !== Number(serverTotal)) {
      console.warn(
        "Total price mismatch. client=",
        total_price,
        "server=",
        serverTotal
      );
    }

    // Insert ke tabel orders
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_price, payment_status, payment_method, payment_reference)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, serverTotal, "COMPLETED", payment_method, null]
    );

    const order = orderResult.rows[0];

    // Insert ke tabel order_items + update stok tiket
    for (const item of itemsToInsert) {
      await client.query(
        `INSERT INTO order_items
          (order_id, event_id, ticket_type, ticket_price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          item.event_id,
          item.ticket_type,
          item.ticket_price,
          item.quantity,
        ]
      );

      await client.query(
        `UPDATE tickets
         SET quantity = quantity - $1
         WHERE id = $2`,
        [item.quantity, item.ticketId]
      );
    }

    await client.query("COMMIT");

    const responseData = {
      order,
      items: itemsToInsert,
    };

    return ok(res, "Order created", responseData, 201);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to create order:", error);
    return fail(res, "Failed to create order", 500, { error: error.message });
  } finally {
    client.release();
  }
};

/**
 * Ambil semua tiket yang dimiliki buyer (berdasarkan user_id).
 * Mengembalikan list baris gabungan order + order_items + events.
 */
const getUserOrders = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, "Unauthorized", 401);

  try {
    const result = await pool.query(
      `SELECT
        o.id AS order_id,
        o.total_price,
        o.payment_status,
        o.payment_method,
        o.payment_reference,
        o.created_at,
        oi.id AS order_item_id,
        oi.event_id,
        e.title AS event_title,
        e.date AS event_date,
        e.location AS event_location,
        oi.ticket_type,
        oi.ticket_price,
        oi.quantity,
        oi.checked_in
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN events e ON e.id = oi.event_id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC`,
      [userId]
    );

    // Group menjadi nested structure
    const grouped = {};

    result.rows.forEach((row) => {
      if (!grouped[row.order_id]) {
        grouped[row.order_id] = {
          id: row.order_id,
          total_price: Number(row.total_price),
          payment_status: row.payment_status,
          payment_method: row.payment_method,
          payment_reference: row.payment_reference,
          created_at: row.created_at,
          items: [],
        };
      }

      grouped[row.order_id].items.push({
        order_item_id: row.order_item_id,
        event_id: row.event_id,
        event_title: row.event_title,
        event_date: row.event_date,
        event_location: row.event_location,
        ticket_type: row.ticket_type,
        ticket_price: Number(row.ticket_price),
        quantity: row.quantity,
        checked_in: row.checked_in,
      });
    });

    return ok(res, "Orders fetched", Object.values(grouped));
  } catch (err) {
    console.error(err);
    return fail(res, "Failed to fetch orders", 500, { error: err.message });
  }
};

export { createOrder, getUserOrders };
