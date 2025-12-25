import { Router } from "express";
import { addAddress, getAddresses,updateAddress,deleteAddress, addToWishlist, removeFromWishlist, getWishlist } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = Router();

// address routes
router.post("/addresses",protectRoute, addAddress)
router.get("/addresses", protectRoute, getAddresses)
router.put("/addresses/:id", protectRoute, updateAddress)
router.delete("/addresses/:id", protectRoute, deleteAddress);

// wishlist routes can be added here similarly

router.post("/wishlist", protectRoute, addToWishlist)
router.delete("/wishlist/:productId", protectRoute, removeFromWishlist);
router.get("/wishlist", protectRoute, getWishlist);

export default router;