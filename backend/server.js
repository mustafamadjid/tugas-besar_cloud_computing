import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import googleAuthRoutes from "./src/routes/googleAuthRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:3000", "https://app.domain.com"];


app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders : ["Content-Type", "Authorization"],
}));
app.use(express.json());

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