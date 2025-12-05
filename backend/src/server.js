import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';

const app = express();
const __dirname = path.resolve();

// API routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// Serve admin panel (production)
app.use(express.static(path.join(__dirname, "../admin/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
});

app.listen(ENV.PORT || 10000, () =>
  console.log(`Sunucu çalıştı! Port: ${ENV.PORT || 10000}`)
);
