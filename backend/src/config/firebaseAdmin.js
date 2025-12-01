// src/firebase/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isCloudRun = !!process.env.K_SERVICE;

if (!admin.apps.length) {
  if (isCloudRun) {
    // ===========================
    // Cloud Run: pakai Secret file
    // ===========================
    const credentialsPath =
      process.env.FIREBASE_CREDENTIALS_PATH ||
      "/var/secrets/firebase/firebase-admin-key"; // fallback

    const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log(
      "🔥 Firebase Admin initialized in Cloud Run using service account JSON from Secret"
    );
  } else {
    // ===========================
    // Lokal: pakai file di repo
    // ===========================
    const serviceAccountPath = path.join(
      __dirname,
      "../../firebase-service-account.json"
    );

    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log(
      "🔥 Firebase Admin initialized locally using firebase-service-account.json"
    );
  }
}

export default admin;
