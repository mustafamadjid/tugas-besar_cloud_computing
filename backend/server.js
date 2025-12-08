import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import googleAuthRoutes from "./src/routes/googleAuthRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import buyerRoutes from "./src/routes/buyerRoutes.js";

dotenv.config();

const app = express();

// Bisa isi banyak origin yang diizinkan
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // FE di Cloud Run atau custom domain
].filter(Boolean); // buang null/undefined

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Ready" });
});

// Routes
app.use("/api/auth", googleAuthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/buyer", buyerRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
