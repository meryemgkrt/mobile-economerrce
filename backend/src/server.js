import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import cors from "cors";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { inngest, functions } from "./config/inngest.js";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";

const app = express();

/* ============================
   ESM __dirname
============================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ============================
   MIDDLEWARE
============================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: ENV.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Request logging (development)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

/* ============================
   TEST INNGEST (CLERK'TEN ÖNCE!)
============================ */
/* ============================
   TEST INNGEST (CLERK'TEN ÖNCE!)
============================ */
app.get("/api/test-inngest", async (req, res) => {  // ✅ POST → GET
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

// Clerk middleware
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
   API ROUTES
============================ */
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/status", (req, res) => {
  res.status(200).json({ 
    message: "Backend çalışıyor ✅",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

/* ============================
   PRODUCTION STATIC (ADMIN)
============================ */
if (process.env.NODE_ENV === "production") {
  const adminDist = path.join(__dirname, "../../admin/dist");

  console.log("🔍 Admin dist kontrol:");
  console.log("📂 __dirname:", __dirname);
  console.log("📂 Admin dist yolu:", adminDist);
  console.log("✅ Var mı?", fs.existsSync(adminDist));
  
  if (fs.existsSync(adminDist)) {
    console.log("📄 Dosyalar:", fs.readdirSync(adminDist).join(", "));
    
    // Serve static files
    app.use(express.static(adminDist));

    // Catch-all - Admin panel için (Express 5 uyumlu)
    app.use((req, res, next) => {
      // API route'larını atla
      if (req.path.startsWith("/api")) {
        return next();
      }
      
      // Admin panel serve et
      res.sendFile(path.join(adminDist, "index.html"));
    });
  } else {
    console.warn("⚠️ Admin dist bulunamadı! Sadece API çalışıyor.");
  }
}

/* ============================
   404 HANDLER (Development)
============================ */
if (process.env.NODE_ENV !== "production") {
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route bulunamadı",
      path: req.path,
    });
  });
}

/* ============================
   ERROR HANDLER
============================ */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  if (err.status === 401 || err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      message: "Yetkisiz erişim",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validasyon hatası",
      errors: err.errors,
    });
  }

  if (err.name === "MongoError" || err.name === "MongoServerError") {
    return res.status(500).json({
      success: false,
      message: "Veritabanı hatası",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === "production" 
      ? "Bir hata oluştu" 
      : err.message,
  });
});

/* ============================
   GRACEFUL SHUTDOWN
============================ */
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} alındı, sunucu kapatılıyor...`);
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

/* ============================
   SERVER START
============================ */
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || ENV.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Server başarıyla başlatıldı`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`⏰ ${new Date().toLocaleString("tr-TR")}`);
    });
  } catch (err) {
    console.error("❌ Server başlatma hatası:", err.message);
    process.exit(1);
  }
};

startServer();