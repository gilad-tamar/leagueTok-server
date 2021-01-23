const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
//const checkAuth = require('../middlewares/checkAuth');

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getBrands
} = require('../controllers/products');

router.get('/', getProducts);
router.get('/brands', getBrands);
router.get('/:productId', getProduct);

//Add checkAuth
router.post('/', upload.uploadProduct.single('image') ,createProduct);
router.patch('/:productId', upload.uploadProduct.single('image'), updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router;