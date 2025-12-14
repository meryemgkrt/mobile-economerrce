import express from "express";
import path from "path";

import { clerkMiddleware } from "@clerk/express"
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js"

const app = express();
app.use(express.json());


const __dirname = path.resolve();
  
app.use(clerkMiddleware());




// ------------------------------
// ✅ HEALTH CHECK
// ------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"../admin/dist")))

  app.get("/{*any",(req,res)=>{
    res.sendFile(path.join(__dirname,"../admin", "dist","index.html"))
  })
}

// ------------------------------
// ✅ PORT (SEVALLA + LOCAL UYUMLU)
// ------------------------------
const starServer=async()=>{
  await connectDB();
  app.listen(ENV.PORT,()=>{
    console.log(`Server running on port ${ENV.PORT}`);
  })
}

starServer();