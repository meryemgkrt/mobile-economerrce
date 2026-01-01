import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/user.model.js";
import { ENV } from "./env.js";

export const inngest = new Inngest({
  id: "economerrce-app",
  signingKey: ENV.INNGEST_SIGNING_KEY,
  signingKeyFallback: ENV.INNGEST_SIGNING_KEY_FALLBACK,
});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
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

    return { ok: true };
  }
);

const deleteUserFromDb = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    await User.deleteOne({ clerkId: event.data.id });
    return { ok: true };
  }
);

export const functions = [syncUser, deleteUserFromDb];