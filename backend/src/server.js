import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

const __dirname = path.resolve();

app.use(clerkMiddleware());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

// app.use("/api/inngest", serve({ client: inngest, functions }));

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("Backend çalışıyor ✅"));
}

const startServer = async () => {
  await connectDB();
  const PORT = ENV.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
