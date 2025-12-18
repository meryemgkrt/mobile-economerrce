import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { inngest, functions } from "./config/inngest.js";

const app = express();
app.use(express.json());

// ✅ Gerçek __dirname (ESM uyumlu)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ============================
   CLERK MIDDLEWARE
   (Backend → SADECE secretKey)
============================ */
app.use(
  clerkMiddleware({
    secretKey: ENV.CLERK_SECRET_KEY,
  })
);

/* ============================
   INNGEST ENDPOINT
============================ */
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
    signingKey: ENV.INNGEST_SIGNING_KEY,
  })
);

/* ============================
   HEALTH CHECK
============================ */
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend çalışıyor ✅" });
});

/* ============================
   ROOT (TEST)
============================ */
app.get("/", (req, res) => {
  res.status(200).send("OK ✅ Backend çalışıyor");
});

/* ============================
   PRODUCTION FRONTEND (Vite)
============================ */
if (process.env.NODE_ENV === "production") {
  const adminDist = path.join(__dirname, "../admin/dist");

  app.use(express.static(adminDist));

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });
}

/* ============================
   SERVER START
============================ */
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || ENV.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Backend başarılı 👍 Port: ${PORT}`);
  });
};

startServer();
