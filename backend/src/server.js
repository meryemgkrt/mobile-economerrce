import express from "express";
import path from "path";
import {ENV} from "./config/env.js";

const app = express();

const __dirname = path.resolve();

app.get("/", (req, res) => {
  res.send("Backend is up and running 🚀");
});

app.get("/api/health", (req, res)=>{
    res.status(200).json({message: "Merhaba kod çalıştı!:))"});
})

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../admin/dist")))

    app.get("/{*any}", (req, res)=>{
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    })
}

app.listen(ENV.PORT, () => {
  console.log(`Sunucu çalıştı! Port: ${ENV.PORT}`);
});