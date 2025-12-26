import {Router} from 'express';
import {getProductById} from '../controllers/product.controller.js';


const router = Router();

router.get("/id", getProductById);


export default router;