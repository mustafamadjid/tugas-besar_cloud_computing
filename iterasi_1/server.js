import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import googleAuthRoutes from "./src/routes/googleAuthRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API Ready" });
});

// Routes
app.use("/api/auth", googleAuthRoutes);


// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});