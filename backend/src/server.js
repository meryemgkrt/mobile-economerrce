import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

// ------------------------------
// ✅ HEALTH CHECK
// ------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// ------------------------------
// ✅ INNGEST ENDPOINT'LERİ
// ------------------------------

// Inngest URL testleri için (panel URL'i denerken 404 almasın diye)
app.get("/api/inngest", (req, res) => {
  res.status(200).send("Inngest GET endpoint is alive");
});

// Gerçek Inngest istekleri için
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
