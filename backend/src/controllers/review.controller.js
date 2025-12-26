import Review from '../models/review.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

export async function createReview(req, res) {
    try {
        const { productId, rating, orderId,userId } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }
        const user = req.user
        // verify product exists and is delivered 
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.clerkId !== user.clerkId) {
            return res.status(403).json({ message: "You can only review products from your own orders" });

        }

        if(order.status !=="delivered"){
            return res.status(400).json({ message: "You can only review products from delivered orders" }); 
        }
        // verify product exists
        const productInOrder= order.orderItems.find(
            (item)=>item.product.toString()===productId.toString()
        );
        if(!productInOrder){
            return res.status(400).json({message: "Product not found in the order"});
        }
        const existingReview=await Review.findOne({
            productId,userId: user._id
        })
        if(existingReview){
            return res.status(400).json({message: "You have already reviewed this product"});
        }
    } catch (error) {

    }
}

export async function deleteReview(req, res) { }
