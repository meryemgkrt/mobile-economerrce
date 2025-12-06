import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname düzeltme
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// **PORT Sevalla için zorunlu — ENV.PORT kullanma**
const PORT = process.env.PORT || 8080;

// API routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// Admin panel serving
app.use(express.static(path.join(__dirname, "../admin/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Sunucu çalıştı! Port: ${PORT}`);
});
