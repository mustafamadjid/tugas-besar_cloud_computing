import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import googleAuthRoutes from "./src/routes/googleAuthRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";

dotenv.config();

const app = express();

// 🔥 Allow ALL origins (sementara)
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔥 Allow semua header & methods (opsional tapi recommended saat debug)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  // Biar browser ga nge-block popup/Google login
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Ready" });
});

// Routes
app.use("/api/auth", googleAuthRoutes);
app.use("/api/events", eventRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
