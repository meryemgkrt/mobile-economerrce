import dotenv from "dotenv";

// .env dosyası varsa yükle (local), yoksa Sevalla env vars kullan (production)
dotenv.config({ path: ".env" });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 10000,
  DB_URL: process.env.DB_URL || "",
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
};

console.log("🔧 Environment loaded:", {
  NODE_ENV: ENV.NODE_ENV,
  PORT: ENV.PORT,
  DB_URL: ENV.DB_URL ? "✅" : "❌",
  CLERK_KEYS: ENV.CLERK_PUBLISHABLE_KEY ? "✅" : "❌"
});