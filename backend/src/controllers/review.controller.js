import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

export async function createReview(req, res) {
  try {
    const { productId, rating, orderId } = req.body;

    // Basic validations
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

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify ownership
    if (order.clerkId !== user.clerkId) {
      return res
        .status(403)
        .json({ message: "You can only review products from your own orders" });
    }

    // Verify delivered
    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "You can only review products from delivered orders" });
    }

    // Verify product is in order
    const productInOrder = order.orderItems?.find(
      (item) => String(item.product) === String(productId)
    );
    if (!productInOrder) {
      return res.status(400).json({ message: "Product not found in the order" });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      productId,
      userId: user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
      productId,
      userId: user._id,
      clerkId: user.clerkId,
      orderId,
      rating: numericRating,
    });

    // Update product rating
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
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Server error", error: error?.message });
  }
}

export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Verify ownership
    if (review.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    const productId = review.productId;
    const deletedRating = review.rating;

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    // Update product rating
    const product = await Product.findById(productId);
    if (product && product.totalRatings > 0) {
      const newTotal = product.totalRatings - 1;

      if (newTotal === 0) {
        // No reviews left
        product.totalRatings = 0;
        product.averageRating = 0;
      } else {
        // Recalculate average
        const currentSum = product.averageRating * product.totalRatings;
        const newAvg = (currentSum - deletedRating) / newTotal;

        product.totalRatings = newTotal;
        product.averageRating = newAvg;
      }

      await product.save();
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error?.message });
  }
}