import express from "express";
import path from "path";
import {clerkMiddleware} from "@clerk/express";
import { ENV } from "./config/env.js";
import { connetDB } from "./config/db.js";

const app = express();

const __dirname = path.resolve();

app.use(clerkMiddleware());

// API routes (bunlar önce olmalı!)
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// Frontend'i serve et (public klasöründen)
app.use(express.static(path.join(__dirname, "public")));

// Fallback: API olmayan tüm route'lar frontend'e gitsin
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(ENV.PORT, () => {
  console.log(`Sunucu çalıştı! Port: ${ENV.PORT}`);
  connetDB();
});