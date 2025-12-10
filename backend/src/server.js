import express from "express";
import path from "path";
import { ENV } from "./config/env.js";
import { connetDB } from "./config/db.js";

const app = express();
app.use(express.json()); // Inngest POST isteği için gerekli

const __dirname = path.resolve();

// ------------------------------
// 🔹 Health Check Route
// ------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// ------------------------------
// 🔹 Inngest Test Endpoint (POST OLMAK ZORUNDA)
// ------------------------------
app.post("/api/inngest", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Inngest endpoint çalışıyor",
    received: req.body, // Inngest gönderirse burada görünür
  });
});

// ------------------------------
// 🔹 Frontend (public) Servisi
// ------------------------------
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Fallback → Frontend index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------------------
// 🔹 Sunucu Başlatma
// ------------------------------
app.listen(ENV.PORT, () => {
  console.log(`Sunucu çalıştı! Port: ${ENV.PORT}`);
  connetDB();
});
