import multer from "multer";
import path from "path";

// Depolama yapılandırması
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt =[ ".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : "";
        const unique =`${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${unique}${safeExt}`);
    }
});

// File filtreleme (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
    const allowTypes = /jpg|jpeg|png|webp/;
    const extname = allowTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimeType = allowTypes.test(file.mimetype);

    if (extname && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Sadece resim dosyalarına izin verilir!"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
