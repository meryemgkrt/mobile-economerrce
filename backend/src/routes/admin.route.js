import { Router } from "express";

// Controllers
import {
  allProduct,
  createProduct,
  updateProduct,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getDashboardStats
} from "../controllers/admin.controller.js";

// Middlewares
import { protectRoute, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";



const router = Router();

// 🔐 Tüm admin route'larını koru
router.use(protectRoute, adminOnly);

// 📦 Products
router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", allProduct);
router.put("/products/:id", upload.array("images", 3), updateProduct);

// 📦 Orders
router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

// 👥 Customers
router.get("/customers", getAllCustomers);

// 📊 Dashboard
router.get("/stats", getDashboardStats);

export default router;
