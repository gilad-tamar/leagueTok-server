const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
//const checkAuth = require('../middlewares/checkAuth');

const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

router.get('/', getAllProducts);
router.get('/:productId', getProduct);

//Add checkAuth
router.post('/', upload.uploadProduct.single('image') ,createProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router;