# Buyers & Orders API (summary)

This file documents the buyer-related endpoints implemented in `src/controller/buyerController.js` and `src/routes/buyerRoutes.js`.

Base path: /api/buyers

Authentication: endpoints that modify or read private data require `Authorization: Bearer <token>` where token is a JWT returned from the Google auth endpoints (/api/auth).

---

Buyer profile endpoints

- GET /api/buyers

  - Public: list all buyer users

- GET /api/buyers/:id

  - Public: get profile info for buyer id

- PUT /api/buyers/:id

  - Auth required: only the owner (id matches token) can update
  - Body: { name?, email? }

- DELETE /api/buyers/:id
  - Auth required: only the owner can delete themselves

---

Order endpoints (per-buyer)

- GET /api/buyers/:buyerId/orders

  - Auth required: owner only

- GET /api/buyers/:buyerId/orders/:orderId

  - Auth required: owner only

- POST /api/buyers/:buyerId/orders

  - Auth required: owner only
  - Body example:
    {
    "payment_method": "card",
    "items": [
    { "event_id": 1, "ticket_type": "VIP", "ticket_price": 100.00, "quantity": 2 },
    { "event_id": 2, "ticket_type": "GENERAL", "ticket_price": 50.00, "quantity": 1 }
    ]
    }
  - The endpoint will validate event ids exist, compute total_price and insert into orders and order_items in a transaction.

- POST /api/buyers/:buyerId/orders/:orderId/cancel
  - Auth required: owner only; sets payment_status = CANCELLED

---

Notes & Caveats

- The code uses the same response format helpers (`ok` and `fail`) used elsewhere in the project.
- Payment logic is minimal: the created order is stored with payment_status = 'PENDING' and `payment_method` kept; actual payment processing should be implemented separately.
- There is a simple validation ensuring referenced events exist. Additional checks (ticket availability, stock, price consistency) may be added depending on the business logic.
