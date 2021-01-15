const mongoose = require('mongoose');
const Product = require('../models/product');
const Stock = require('../models/stock');
const Category = require('../models/category');

module.exports = {
    getAllProducts: (req, res) => {
        Product.find().populate('categoryId', 'name').then((products) => {
            res.status(200).json({
                products
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    getProduct: (req, res) => {
        const productId = req.params.productId;
        
        Product.findById(productId).then((product) => {
            res.status(200).json({
                product
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    createProduct: (req, res) => {
        const { path: image } = req.file;
        const { name, gender, brand, stock, price, categoryId } = req.body;

        Category.findById(categoryId).then((category) => {
            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                })
            }

            const product = new Product({
                _id: new mongoose.Types.ObjectId(),
                name,
                gender,
                brand,
                stock: new Stock(stock),
                image: image.split('\\').join('/'),
                price,
                dateAdded: Date.now(),
                categoryId
            });

            return product.save();
        }).then(() => {
            res.status(200).json({
                message: 'Created product'
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    updateProduct: (req, res) => {
        const productId = req.params.productId;
        const { categoryId } = req.body;

        Product.findById(productId).then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
        }).then(() => {
            if (categoryId) {
                return Category.findById(categoryId).then((category) => {
                    if (!category) {
                        return res.status(404).json({
                            message: 'Category not found'
                        })
                    }

                    return Product.updateOne({ _id: productId }, req.body);
                }).then(() => {
                    res.status(200).json({
                        message: 'Product Updated'
                    })
                }).catch(error => {
                    res.status(500).json({
                        error
                    })
                });
            }

            Product.updateOne({ _id: productId }, req.body).then(() => {
                res.status(200).json({
                    message: 'Product Updated'
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    },
    deleteProduct: (req, res) => {
        const productId = req.params.productId

        Product.findById(productId).then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
        }).then(() => {
            Product.deleteOne({ _id: productId }).then(() => {
                res.status(200).json({
                    message: `Product _id:${productId} Deleted`
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    }
}