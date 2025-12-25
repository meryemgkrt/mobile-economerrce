import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export async function createProduct(req, res) {
  try {
    const { name, description, price, category, stock } = req.body;
    
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır." });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Fiyat 0'dan büyük olmalıdır." });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "Stok negatif olamaz." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "En az bir resim yüklenmelidir." });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: "En fazla 3 resim yüklenebilir." });
    }

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, { folder: "products" });
    });

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images: imageUrls,
    });

    res.status(201).json({
      message: "Ürün başarıyla oluşturuldu",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
}

export async function allProduct(_, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    if (price && price <= 0) {
      return res.status(400).json({ message: "Fiyat 0'dan büyük olmalıdır." });
    }

    if (stock && stock < 0) {
      return res.status(400).json({ message: "Stok negatif olamaz." });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: "En fazla 3 resim yüklenebilir." });
      }

      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, { folder: "products" });
      });

      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map((result) => result.secure_url);
    }

    await product.save();
    res.status(200).json({ message: "Ürün güncellendi", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
}

/* export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    res.status(200).json({ message: "Ürün silindi." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
} */

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered", "canceled"].includes(status)) {
      return res.status(400).json({ message: "Geçersiz sipariş durumu." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }

    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();
    res.status(200).json({ message: "Sipariş durumu güncellendi.", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
}

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
}

export async function getDashboardStats(_, res) {
  try {
    const totalOrders = await Order.countDocuments();
    
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    const totalRevenue = revenueResult[0] ? revenueResult[0].total : 0;
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Hata oluştu" });
  }
}