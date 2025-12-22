import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";

export async function createProduct(req, res) {
    try {
        const { name, description, price, category, stock } = req.body;
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır." });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "En az bir resim yüklenmelidir." });
        }
        if (req.files.length > 3) {
            return res.status(400).json({ message: "En fazla 3 resim yüklenebilir." });
        }
        const uploadPromises = req.files.map((file) => {
            return cloudinary.uploader.upload(file.path, { folder: "products" });
        })

        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map((result) => result.secure_url);
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            images: imageUrls
        });
        res.status(201).json({
            message: "Ürün başarıyla oluşturuldu", product
        })

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Hata oluştu" });
    }
}

export async function allProduct(_, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); // ← await eksikti
        res.status(200).json(products)
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

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (stock) product.stock = stock;
        
        // Eğer yeni bir resim yüklenmişse
        if (req.files && req.files.length > 0) { 
            if (req.files.length > 3) {
                return res.status(400).json({ message: "En fazla 3 resim yüklenebilir." });
            }
            const uploadPromises = req.files.map((file) => {
                return cloudinary.uploader.upload(file.path, { folder: "products" });
            })
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

export async function deleteProduct(req, res) {} 