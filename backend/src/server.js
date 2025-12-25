import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { inngest, functions } from "./config/inngest.js";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js"; 
import orderRoutes from "./routes/order.route.js";

const app = express();
app.use(express.json());

// ✅ Gerçek __dirname (ESM uyumlu)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ============================
   CLERK MIDDLEWARE
============================ */
app.use(clerkMiddleware());

/* ============================
   INNGEST ENDPOINT
============================ */
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
    signingKey: ENV.INNGEST_SIGNING_KEY,
    signingKeyFallback: ENV.INNGEST_SIGNING_KEY_FALLBACK,
  })
);

/* ============================
   TEST INNGEST (DEVELOPMENT)
============================ */
app.post("/api/test-inngest", async (req, res) => {
  try {
    await inngest.send({
      name: "clerk/user.created",
      data: {
        id: "test_user_" + Date.now(),
        email_addresses: [{ email_address: "test@example.com" }],
        first_name: "Test",
        last_name: "User",
        image_url: "https://example.com/avatar.jpg",
      },
    });

    res.json({
      success: true,
      message: "✅ Test event gönderildi! Inngest Runs sayfasını kontrol et.",
    });
  } catch (error) {
    console.error("Inngest test error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ============================
   ADMIN ROUTES
============================ */
app.use("/api/admin", adminRoutes);

/* ============================
   USER ROUTES (İSTERSEN AÇ)
 */
app.use("/api/users", userRoutes);

/* ============================
    ORDER ROUTES (İSTERSEN AÇ)
============================ */
app.use("/api/orders", orderRoutes);

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
   PRODUCTION STATIC (ADMIN)
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
  try {
    await connectDB();

    const PORT = process.env.PORT || ENV.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Backend başarılı 👍 Port: ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server başlatma hatası:", err.message);
    process.exit(1);
  }
};

startServer();