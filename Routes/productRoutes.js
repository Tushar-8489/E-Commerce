const express = require("express");
const { requiredSignIn, isAdmin } = require("../Middleware/authMiddleware");
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productCountController, productListController, searchProductController, relatedProductController } = require("../controllers/productController");
const formidable = require("express-formidable");

const router  = express.Router();

//routes
router.post('/create-product', requiredSignIn, isAdmin, formidable(), createProductController);
router.put('/update-product/:pid', requiredSignIn, isAdmin, formidable(), updateProductController);

//get Products
router.get('/get-products', getProductController);

//single Product
router.get('/get-products/:slug', getSingleProductController);

//get Photo
router.get('/product-photo/:pid', productPhotoController);

//delete product
router.delete('/delete-product/:pid', deleteProductController);

//product count
router.get('/product-count', productCountController);

//product per page
router.get('/product-list/:page', productListController);

//Seach Product
router.get('/search/:keyword', searchProductController);

//Similar Products
router.get('/related-product/:pid/:cid', relatedProductController);

module.exports = router;