import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import googleAuthRoutes from "./src/routes/googleAuthRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import buyerRoutes from "./src/routes/buyerRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // untuk curl/postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // kalau kamu pakai cookie/session
  })
);

app.use(express.json());

app.get("/", (req, res) => res.json({ message: "API Ready" }));

app.use("/api/auth", googleAuthRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/buyer", buyerRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
