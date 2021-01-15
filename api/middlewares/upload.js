const multer = require('multer');

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }

    cb(null, false)
}

//Product
const storageProducts = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const uploadProduct = multer({
    storage: storageProducts,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter
});

//Category
const storageCategories = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/categories');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const uploadCategory = multer({
    storage: storageCategories,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter
});

//Exports
module.exports = {
    uploadProduct: uploadProduct,
    uploadCategory: uploadCategory
}