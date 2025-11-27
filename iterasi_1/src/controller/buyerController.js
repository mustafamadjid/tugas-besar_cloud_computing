import { pool } from "../config/database.js";

// Helper untuk response uniform
const ok = (res, message, data = null, status = 200) => res.status(status).json({ success: true, message, data });

const fail = (res, message, status = 400, data = null) => res.status(status).json({ success: false, message, data });

// --- Buyer CRUD (profile) ---
const getAllBuyers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE role = 'BUYER' ORDER BY created_at DESC"
    );
    return ok(res, "Buyers fetched", result.rows);
  } catch (error) {
    return fail(res, "Failed to fetch buyers", 500, { error: error.message });
  }
};

const getBuyerById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1 AND role = 'BUYER'",
      [id]
    );
    if (result.rows.length === 0) return fail(res, "Buyer not found", 404);
    return ok(res, "Buyer fetched", result.rows[0]);
  } catch (error) {
    return fail(res, "Failed to fetch buyer", 500, { error: error.message });
  }
};

const updateBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Only the owner can update their profile
    if (!req.user || Number(req.user.id) !== Number(id)) {
      return fail(res, "Forbidden: you can only update your own profile", 403);
    }

    // if email is provided, ensure not used by other user
    if (email) {
      const emailCheck = await pool.query("SELECT id FROM users WHERE email = $1 AND id <> $2", [email, id]);
      if (emailCheck.rows.length > 0) return fail(res, "Email already in use", 400);
    }

    const result = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING id, name, email, role, created_at`,
      [name ?? null, email ?? null, id]
    );

    return ok(res, "Buyer updated", result.rows[0]);
  } catch (error) {
    return fail(res, "Failed to update buyer", 500, { error: error.message });
  }
};

const deleteBuyer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || Number(req.user.id) !== Number(id)) {
      return fail(res, "Forbidden: you can only delete your own account", 403);
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return ok(res, "Buyer deleted", null, 200);
  } catch (error) {
    return fail(res, "Failed to delete buyer", 500, { error: error.message });
  }
};

// --- Orders / Purchases for buyers ---

const getBuyerOrders = async (req, res) => {
  try {
    const { buyerId } = req.params;

    if (!req.user || Number(req.user.id) !== Number(buyerId)) {
      return fail(res, "Forbidden: you can only view your own orders", 403);
    }

    const ordersResult = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [
      buyerId,
    ]);

    const orders = ordersResult.rows;

    // fetch items for each order
    for (const o of orders) {
      const items = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [o.id]);
      o.items = items.rows;
    }

    return ok(res, "Orders fetched", orders);
  } catch (error) {
    return fail(res, "Failed to fetch orders", 500, { error: error.message });
  }
};

const getBuyerOrderById = async (req, res) => {
  try {
    const { buyerId, orderId } = req.params;

    if (!req.user || Number(req.user.id) !== Number(buyerId)) {
      return fail(res, "Forbidden: you can only view your own order", 403);
    }

    const orderRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [orderId, buyerId]);
    if (orderRes.rows.length === 0) return fail(res, "Order not found", 404);

    const items = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [orderId]);
    const order = orderRes.rows[0];
    order.items = items.rows;

    return ok(res, "Order fetched", order);
  } catch (error) {
    return fail(res, "Failed to fetch order", 500, { error: error.message });
  }
};

const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { buyerId } = req.params;
    const { items, payment_method } = req.body;

    if (!req.user || Number(req.user.id) !== Number(buyerId)) {
      return fail(res, "Forbidden: you can only create orders for yourself", 403);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return fail(res, "items is required and should be a non-empty array", 400);
    }

    // validate event IDs and compute total_price
    let total = 0;
    for (const it of items) {
      const { event_id, ticket_price, quantity } = it;
      if (!event_id || ticket_price == null || quantity == null) {
        return fail(res, "each item must include event_id, ticket_price and quantity", 400);
      }

      // make sure event exists
      const ev = await pool.query("SELECT id FROM events WHERE id = $1", [event_id]);
      if (ev.rows.length === 0) return fail(res, `Event not found: ${event_id}`, 404);

      total += Number(ticket_price) * Number(quantity);
    }

    await client.query("BEGIN");

    const orderInsert = await client.query(
      "INSERT INTO orders (user_id, total_price, payment_method, payment_status) VALUES ($1, $2, $3, $4) RETURNING *",
      [buyerId, total, payment_method ?? null, "PENDING"]
    );

    const order = orderInsert.rows[0];

    for (const it of items) {
      await client.query(
        `INSERT INTO order_items (order_id, event_id, ticket_type, ticket_price, quantity) VALUES ($1, $2, $3, $4, $5)`,
        [order.id, it.event_id, it.ticket_type ?? "GENERAL", it.ticket_price, it.quantity]
      );
    }

    await client.query("COMMIT");

    // fetch created items
    const itemsInserted = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
    order.items = itemsInserted.rows;

    return ok(res, "Order created", order, 201);
  } catch (error) {
    await client.query("ROLLBACK");
    return fail(res, "Failed to create order", 500, { error: error.message });
  } finally {
    client.release();
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { buyerId, orderId } = req.params;

    if (!req.user || Number(req.user.id) !== Number(buyerId)) {
      return fail(res, "Forbidden: you can only cancel your own order", 403);
    }

    const orderRes = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [orderId, buyerId]);
    if (orderRes.rows.length === 0) return fail(res, "Order not found", 404);

    if (orderRes.rows[0].payment_status === "CANCELLED") {
      return fail(res, "Order already cancelled", 400);
    }

    const updated = await pool.query(
      "UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      ["CANCELLED", orderId]
    );

    return ok(res, "Order cancelled", updated.rows[0]);
  } catch (error) {
    return fail(res, "Failed to cancel order", 500, { error: error.message });
  }
};

export {
  ok,
  fail,
  getAllBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
  getBuyerOrders,
  getBuyerOrderById,
  createOrder,
  cancelOrder,
};
