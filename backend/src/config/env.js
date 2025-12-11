import dotenv from "dotenv";

// Sadece local development için .env yükle
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 10000,
  DB_URL: process.env.DB_URL ,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY 
};