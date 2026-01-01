import { requireAuth } from "@clerk/express";
import User from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
  requireAuth(),

  async (req, res, next) => {  // ✅ next eklendi
    try {
      const clerkId = req.auth.userId;  // ✅ req.auth() → req.auth
      
      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      }

      const user = await User.findOne({ clerkId });
      
      if (!user) {
        return res.status(404).json({ message: "Unauthorized - User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("ProtectRoute Hatası:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
];

export const adminOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - No user info" });
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden - Admins only" });
  }
  
  next();
};