import { pool } from "../config/database.js";

const ok = (res, message, data = null, status = 200) =>
  res.status(status).json({ success: true, message, data });

const fail = (res, message, status = 400, data = null) =>
  res.status(status).json({ success: false, message, data });

export const getPromoterProfile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return fail(res, "Unauthorized", 401);
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, role, provider, google_uid, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return fail(res, "Promoter not found", 404);
    }

    const user = rows[0];

    if (user.role !== "PROMOTER") {
      return fail(res, "Forbidden: profile available for promoter only", 403);
    }

    return ok(res, "Profile fetched", user);
  } catch (error) {
    console.error("Failed to fetch promoter profile", error);
    return fail(res, "Failed to fetch profile", 500, { error: error.message });
  }
};
