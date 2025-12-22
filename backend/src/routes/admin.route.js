import {Router} from "express";
import {allProduct, createProduct, updateProduct, deleteProduct} from "../controllers/admin.controller.js";
import {protectRoute, adminOnly} from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router();

// options middleware
router.use(protectRoute, adminOnly);

// Tek resim yükleme için .single() kullan
router.post("/products", upload.array('images',3), createProduct);
router.get("/products", allProduct);
router.put("/products/:id",upload.array('images',3), updateProduct); 
router.delete("/products/:id", deleteProduct);

export default router;