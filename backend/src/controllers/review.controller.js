import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export async function createReview(req, res) {
  try {
    const { productId, rating, orderId } = req.body;

    // basic validations
    if (!productId || !orderId) {
      return res.status(400).json({ message: "productId and orderId are required" });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // verify ownership
    if (order.clerkId !== user.clerkId) {
      return res
        .status(403)
        .json({ message: "You can only review products from your own orders" });
    }

    // verify delivered
    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "You can only review products from delivered orders" });
    }

    // verify product is in order
    const productInOrder = order.orderItems?.find(
      (item) => String(item.product) === String(productId)
    );
    if (!productInOrder) {
      return res.status(400).json({ message: "Product not found in the order" });
    }

    // prevent duplicate review
    const existingReview = await Review.findOne({
      productId,
      userId: user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // create review
    const review = await Review.create({
      productId,
      userId: user._id,
      clerkId: user.clerkId,
      orderId,
      rating: numericRating,
    });

    // (optional) if your Product schema tracks rating counts/avg
    // If your schema doesn't have these fields, remove this block.
    const product = await Product.findById(productId);
    if (product) {
      const total = Number(product.totalRatings || 0) + 1;
      const currentAvg = Number(product.averageRating || 0);
      const newAvg = ((currentAvg * (total - 1)) + numericRating) / total;

      product.totalRatings = total;
      product.averageRating = newAvg;
      await product.save();
    }

    return res.status(201).json({ message: "Review created", review });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error?.message });
  }
}

export async function deleteReview(req, res) { }
