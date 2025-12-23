import { Router } from "express";
import { addAddress, getAddresses,updateAddress } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = Router();


router.post("/addresses",protectRoute, addAddress)
router.get("/addresses", protectRoute, getAddresses)
router.put("/addresses/:id", protectRoute, updateAddress)


export default router;