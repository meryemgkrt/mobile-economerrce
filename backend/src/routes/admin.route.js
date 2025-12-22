import {Router} from "express";
import {allProduct, createProduct, updateProduct} from "../controllers/admin.controller.js";
import {protectRoute, adminOnly} from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router();

router.use(protectRoute, adminOnly);


router.post("/products", upload.array('images', 3), createProduct);
router.get("/products", allProduct);
router.put("/products/:id", upload.single('image'), updateProduct);
//router.delete("/products/:id", deleteProduct);

export default router;