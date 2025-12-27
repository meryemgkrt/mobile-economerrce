import {Router} from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';
import { addToCart, clearCart, getCart, updateCartItem , removeCartItem} from '../controllers/cart.controller.js';


const router = Router();
router.use(protectRoute);
router.get("/",getCart)
router.post("/", addToCart)
router.put("/:itemId", updateCartItem)
router.delete("/:itemId", removeCartItem)
router.delete("/", clearCart)


export default router;