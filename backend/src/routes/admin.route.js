import {Router} from "express";
import {allProduct, createProduct, updateProduct,deleteProduct} from "../controllers/admin.controller.js";
import {protectRoute, adminOnly} from "../middleware/auth.middleware.js";


const router = Router();
// options middleware
router.use(protectRoute, adminOnly);

router.post("/products",  createProduct);
router.get("/products",allProduct)
router.put("/products/:id",updateProduct)
router.delete("/products/:id",deleteProduct)


export default router;
