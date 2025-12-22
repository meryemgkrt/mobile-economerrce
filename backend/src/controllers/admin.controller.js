import cloudinary from "../config/cloudinary.js";
export  const createProduct = (req, res) => {
    try {
        const {name, description, price, category, stock} = req.body;
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({message: "Tüm alanlar doldurulmalıdır."});
        }
        if(!req.files || req.files.length === 0){
            return res.status(400).json({message: "En az bir resim yüklenmelidir."});
        }
        if(req.files.length > 3){
            return res.status(400).json({message: "En fazla 3 resim yüklenebilir."});
        }
        const uploadPromeses = req.files.map((file)=>{
            return cloudinary.upload(file.patj,{folder:"products"});
        })
    } catch (error) {
        
    }
};
export  const allProduct = (req, res) => {};
export  const updateProduct = (req, res) => {};
export  const deleteProduct = (req, res) => {};