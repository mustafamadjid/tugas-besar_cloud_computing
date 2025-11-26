import admin from "firebase-admin";
import { pool } from "../config/database.js";
import { generateToken } from "../utils/token.js";
import serviceAccount from "../../firebase-service-account.json" with { type: "json" };

// Inisialisasi Firebase Admin (sekali)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized");
}

// POST /api/auth/google
export const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken diperlukan" });
    }

    // Verifikasi token dari client (frontend Firebase)
    const decoded = await admin.auth().verifyIdToken(idToken);

    const email = decoded.email;
    const name = decoded.name || "Google User";
    const googleUid = decoded.uid;

    if (!email) {
      return res.status(400).json({
        message: "Email tidak ditemukan di Google token",
      });
    }

    // cek apakah user sudah ada
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    let user;

    if (existing.rows.length > 0) {
      user = existing.rows[0];

      // kalau provider sebelumnya local, boleh saja — tapi kamu bisa atur policy sendiri
      // di sini kita hanya update google_uid jika belum ada
      if (!user.google_uid) {
        const update = await pool.query(
          `
          UPDATE users
          SET google_uid = $1, provider = 'google'
          WHERE id = $2
          RETURNING id, name, email, role, provider, google_uid, created_at
          `,
          [googleUid, user.id]
        );
        user = update.rows[0];
      }
    } else {
      // buat user baru
      const insert = await pool.query(
        `
        INSERT INTO users (name, email, provider, google_uid, role)
        VALUES ($1, $2, 'google', $3, 'CONSUMER')
        RETURNING id, name, email, role, provider, google_uid, created_at
        `,
        [name, email, googleUid]
      );

      user = insert.rows[0];
    }

    const token = generateToken(user);

    return res.json({
      message: "Login Google berhasil",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
        google_uid: user.google_uid,
        created_at: user.created_at,
        token,
      },
    });
  } catch (err) {
    console.error("Google SignIn error:", err);
    return res.status(401).json({ message: "Google token invalid" });
  }
};
