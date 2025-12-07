import express from "express";
import path from "path";
import {ENV} from "./config/env.js";

const app = express();

const __dirname = path.resolve();

app.get("/api/health", (req, res)=>{
    res.status(200).json({message: "Merhaba kod çalıştı!:))"});
})

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../admin/dist")))

    app.get("/{*any}", (req, res)=>{
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    })
}

a

app.listen(ENVPORT, () => {
  console.log(`Sunucu çalıştı! Port: ${PORT}`);
});
