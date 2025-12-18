import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { inngest, functions } from "./config/inngest.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

app.use(clerkMiddleware());

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend çalışıyor ✅" });
});

// INNGEST ENDPOINT
app.use("/api/inngest", serve({ client: inngest, functions }));

// PROD FRONTEND
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
  });
}

// START SERVER
const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () =>
    console.log(`🚀 Server running on port ${ENV.PORT}`)
  );
};

startServer();
