import {Router} from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';
import {addAllReview, getProductById} from '../controllers/review.controller.js';


const router = Router();

router.post("/", protectRoute, addAllReview);
router.get("/id", protectRoute, getProductById);


export default router;