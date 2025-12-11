import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

// ------------------------------
// ✅ ROOT ENDPOINT (Sevalla için)
// ------------------------------
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Backend API running 🚀",
    endpoints: {
      health: "/api/health",
      inngest: "/api/inngest"
    }
  });
});

// ------------------------------
// ✅ HEALTH CHECK
// ------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// ------------------------------
// ✅ INNGEST ENDPOINTS
// ------------------------------
app.get("/api/inngest", (req, res) => {
  res.status(200).send("Inngest GET endpoint is alive");
});

app.post("/api/inngest", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Inngest endpoint çalışıyor!",
    received: req.body,
  });
});

// ------------------------------
// ✅ PORT (SEVALLA + LOCAL UYUMLU)
// ------------------------------
const PORT = process.env.PORT || ENV.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});