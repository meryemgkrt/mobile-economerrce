import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export async function getCart(req, res) {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        if (!cart) {
            const user= req.user
            cart = await Cart.create({user:user._id,
                clerkId:user.clerkId,
                items:[]
            })
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Sepet alınırken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
        
    }
}

export async function addToCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        // verilen ürünün geçerli olup olmadığını kontrol et

        const product= await Product.findById(productId)
        if(!product){
            return res.status(404).json({error:"Ürün bulunamadı"})
        }
        if(product.stock< quantity){
            return res.status(400).json({error:"Yeterli stok yok"})
        }
       let cart = await Cart.findOne({ user: req.user.id });
         if(!cart){
          const user= req.user
          cart = await Cart.create({user:user._id,
                clerkId:user.clerkId,
                items:[]
          })
         } 

         const existingItem=cart.items.find(item => item.product.toString() === productId);
            if(existingItem){
            const newQuantity= existingItem.quantity + 1
            if(product.stock< newQuantity){
                return res.status(400).json({error:"Yeterli stok yok"})
            }
            existingItem.quantity=newQuantity
            }else{
                cart.items.push({product:productId, quantity:quantity}) 
            }
            await cart.save();
            res.status(200).json(cart);
    } catch (error) {
        console.error("Sepete ürün eklenirken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
        
    }
}

export async function updateCartItem(req, res) {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ error: "Miktar en az 1 olmalıdır." });
        }
        
        const cart = await Cart.findOne({clerkId: req.user.clerkId });
        if (!cart) {
            return res.status(404).json({ error: "Sepet bulunamadı." });
        }
        const itemIndex=cart.items.findIndex((item)=>item.product.toString()===productId)
        if(itemIndex===-1){
            return res.status(404).json({ error: "Sepet öğesi bulunamadı." });
        }
        // Ürünün stok durumunu kontrol et
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Ürün bulunamadı." });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ error: "Yeterli stok yok." });
        }
        
        // Sepet öğesinin miktarını güncelle
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message: "Sepet öğesi güncellendi.", cart });
        
    } catch (error) {
        console.error("Sepet öğesi güncellenirken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
    }
}

export async function removeCartItem(req, res) {
    try {
        const {productId}= req.params;
        const cart = await Cart.findOne({clerkId: req.user.clerkId });
        if (!cart) {
            return res.status(404).json({ error: "Sepet bulunamadı." });
        }
        const itemIndex=cart.items.findIndex((item)=>item.product.toString()===productId)
        if(itemIndex===-1){
            return res.status(404).json({ error: "Sepet öğesi bulunamadı." });
        }
        cart.items.splice(itemIndex,1);
        await cart.save();
        res.status(200).json({message:"Sepet öğesi kaldırıldı.", cart});
    } catch (error) {
        console.error("Sepet öğesi kaldırılırken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
    }
    
}

export async function clearCart(req, res) {
    try {
        const cart = await Cart.findOne({clerkId: req.user.clerkId });
        if (!cart) {
            return res.status(404).json({ error: "Sepet bulunamadı." });
        }
        cart.items=[];
        await cart.save();
        res.status(200).json({message:"Sepet temizlendi.", cart});
        
    } catch (error) {
        console.error("Sepet temizlenirken hata oluştu:", error);
        res.status(500).json({ error: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
        
    }
}
