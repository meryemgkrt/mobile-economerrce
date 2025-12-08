import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connetDB =async()=>{
    try {
        const conn= await mongoose.connect(ENV.DB_URL);
            console.log(`🚀Connected to MongoDB: ${conn.connection.host}`)
        
    } catch (error) {
        console.error(`😱Error: ${error.message}`);
        process.exit(1);
        
    }
}
