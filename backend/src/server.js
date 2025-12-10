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
// ✅ INNGEST ENDPOINT (POST ZORUNLU)
// ------------------------------
app.post("/api/inngest", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Inngest endpoint çalışıyor!",
    received: req.body,
  });
});

// ------------------------------
// ✅ FRONTEND (PUBLIC)
// ------------------------------
app.use(express.static(path.join(__dirname, "public")));

// ------------------------------
// ✅ NODE 24 UYUMLU FALLBACK (WILDCARD HATASI YOK)
// ------------------------------
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------------------
// ✅ PORT (SEVALLA + LOCAL UYUMLU)
// ------------------------------
const PORT = process.env.PORT || ENV.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
