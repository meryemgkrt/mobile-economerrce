import express from 'express';
import path from 'path';
import {ENV} from './config/env.js';
const app = express();

const __dirname = path.resolve();

// API routes
app.get("/api/health", (req,res)=>{
    res.status(200).json({message:"Merhaba kod çalıştı!:))"});
})

// Production - Admin panel
if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../admin/dist")));
    
    // Catch-all route - en sona koy
    app.use((req,res)=>{
        res.sendFile(path.join(__dirname,"../admin","dist","index.html"));
    })
}

app.listen(ENV.PORT, ()=>console.log(`Merhaba sunucu çalıştı! Port: ${ENV.PORT}`));