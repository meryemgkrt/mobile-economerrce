import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from '../models/user.js';
import { ENV } from "./env.js";

export const inngest = new Inngest({ 
  id: "economerrce-app",
  eventKey: ENV.INNGEST_SIGNING_KEY // ← Event key ekle
});

const syncUser = inngest.createFunction(
  { id: "sync/user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      console.log("🔵 User sync başladı:", event.data.id);
      
      await connectDB();

      const { id, email_addresses, first_name, last_name, image_url } = event.data;

      const newUser = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        imageUrl: image_url || "",
        addresses: [],
        wishlist: [],
      };

      await User.updateOne(
        { clerkId: id }, 
        { $setOnInsert: newUser }, 
        { upsert: true }
      );

      console.log("✅ User kaydedildi:", id);
      return { success: true, userId: id };
      
    } catch (error) {
      console.error("❌ User sync hatası:", error.message);
      throw error; // Inngest retry yapabilsin
    }
  }
);

const deleteUserFromDb = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      console.log("🔴 User silme başladı:", event.data.id);
      
      await connectDB();
      
      const { id } = event.data;
      const result = await User.deleteOne({ clerkId: id });
      
      console.log("✅ User silindi:", id, "deleted:", result.deletedCount);
      return { success: true, deletedCount: result.deletedCount };
      
    } catch (error) {
      console.error("❌ User silme hatası:", error.message);
      throw error;
    }
  }
);

export const functions = [syncUser, deleteUserFromDb];