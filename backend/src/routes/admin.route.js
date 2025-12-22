import {Router} from "express";
import {allProduct, createProduct, updateProduct, deleteProduct} from "../controllers/admin.controller.js";
import {protectRoute, adminOnly} from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router();

// options middleware
router.use(protectRoute, adminOnly);

// Tek resim yükleme için .single() kullan
router.post("/products", upload.single('image'), createProduct);
router.get("/products", allProduct);
router.put("/products/:id", upload.single('image'), updateProduct); // Update için de
router.delete("/products/:id", deleteProduct);

export default router;