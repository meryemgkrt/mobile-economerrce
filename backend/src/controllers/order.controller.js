import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";


export async function createOrder(req, res) {
try {
    const user=req.user;
    const {orderItems, shippingAddress, paymentResult, totalPrice} = req.body;
    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({message: "Sipariş öğeleri bulunamadı"});
    }
    for (const item of orderItems){
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({message: `Ürün bulunamadı: ${item.product}`});
        }
        if(product.stock < item.quantity){
            return res.status(400).json({message: `Yetersiz stok: ${product.name}`});
        }
    }
    const order = new Order({
        user: user._id,
        orderItems,
        shippingAddress,
        paymentResult,
        totalPrice,
    });
    const createdOrder = await order.save();
    for (const item of orderItems){
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save();
    }
    res.status(201).json(createdOrder);
} catch (error) {
    console.error("Sipariş oluşturulurken hata oluştu:", error);
    res.status(500).json({ message: "Sipariş oluşturulurken hata oluştu", error: error.message });
}
}
export async function getUserOrders(req, res) {
    try {
        const orders= await Order.find({clerkId:req.user.clerkId})
        .populate("orderItems.product")
        .sort({createdAt:-1});

    const orderIds= orders.map((order)=>order._id);
    const reviews= await Review.find({orderId:{$in:orderIds}});
    const reviewedOrderIds= new Set(reviews.map((review)=>review.orderId.toString()));    

    const orderWithReviewStatus= await Promise.all(orders.map(async(order)=>{
        const review = await Review.findOne({
            orderId: order._id,
        })
        return {
            ...order.toObject(),
            hasReview: !!review,
        };
    }))

        res.status(200).json({orders: orderWithReviewStatus});
        
    } catch (error) {
        console.error("Kullanıcı siparişleri alınırken hata oluştu:", error);
        res.status(500).json({ message: "Kullanıcı siparişleri alınırken hata oluştu", error: error.message });
        
    }
}