import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Flag sederhana untuk cek apakah sedang di GCP (Cloud Run)
const isRunningInGCP = !!process.env.K_SERVICE; // env ini otomatis ada di Cloud Run

if (!admin.apps.length) {
  if (isRunningInGCP) {
    // ============================
    //  PROD: Cloud Run
    // ============================
    // Pakai Application Default Credentials (service account Cloud Run)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log(
      "✅ Firebase Admin initialized with applicationDefault() (Cloud Run)"
    );
  } else {
    // ============================
    //  LOKAL: pakai JSON file
    // ============================
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
      "✅ Firebase Admin initialized with service-account JSON (local)"
    );
  }
}

export default admin;
