const { isAdmin, requiredSignIn } = require ('../Middleware/authMiddleware');
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require('../controllers/categoryController');

const express = require('express');

const router = express.Router();


//create category
router.post('/create-category',requiredSignIn, isAdmin,  createCategoryController);

//update category

router.put("/update-category/:id", requiredSignIn, isAdmin, updateCategoryController);

//getAll category
router.get('/get-category', categoryController);

//single category
router.get('/single-category/:slug', singleCategoryController);

//delete Category
router.delete('/delete-category/:id', requiredSignIn, isAdmin, deleteCategoryController);

module.exports =  router;