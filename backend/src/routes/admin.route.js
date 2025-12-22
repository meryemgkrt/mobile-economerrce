import {Router} from "express";
import {allProduct, createProduct, updateProduct, getAllOrders, updateOrderStatus,getAllCustomers, getDashboardStats} from "../controllers/admin.controller.js";
import {protectRoute, adminOnly} from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"
import { get } from "mongoose";

const router = Router();

router.use(protectRoute, adminOnly);


router.post("/products", upload.array('images', 3), createProduct);
router.get("/products", allProduct);
router.put("/products/:id", upload.array('images', 3), updateProduct);
router.get("/orders", getAllOrders)
router.patch("/orders/:orderId/status", updateOrderStatus) 
router.get("/customers", getAllCustomers)
router.get("/stats", getDashboardStats)


export default router;