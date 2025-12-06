import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// __dirname düzeltme (ESM için zorunlu)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// PORT → Sevalla mutlaka bunu kullanır
const PORT = process.env.PORT || 10000;

// HEALTH CHECK route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// ADMIN PANEL (React / Vite build)
const adminPath = path.join(__dirname, "../admin/dist");

// Statik dosyalar
app.use(express.static(adminPath));

// Tüm diğer route’ları index.html'e yönlendir
app.get("*", (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

// SERVER START
app.listen(PORT, () => {
  console.log(`Sunucu çalıştı! Port: ${PORT}`);
});
