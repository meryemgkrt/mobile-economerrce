import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

app.use(clerkMiddleware());

// ✅ HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// ✅ PRODUCTION: admin/dist serve + SPA fallback
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  // ✅ API dışındaki her şeyi index.html'e gönder
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
  });
} else {
  // ✅ local test için root route (opsiyonel ama iyi)
  app.get("/", (req, res) => res.send("Backend çalışıyor ✅"));
}

// ✅ PORT
const startServer = async () => {
  await connectDB();
  const PORT = ENV.PORT || process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
