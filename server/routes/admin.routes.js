const express = require('express');
const admin_router = express.Router();
const protectRoute = require('../middleware/protectRoute');




const { 
    adminLogin,
    adminLogout,
    adminRefresh,

 } = require('../controllers/admin.controller');
// auth routes
admin_router.post('/login',adminLogin);
admin_router.get('/logout',adminLogout);
admin_router.get('/refresh',protectRoute,adminRefresh);


// category
const {
    addCategory,
    unlistCategory,
    editCategory,
    fetchCategory,
    listCategory,
    addSubCategory,
    updateSubCategory,
    unlistSubCategory,
    listSubCategory,
    addProductCategoryListing
} = require('../controllers/category.controller');

admin_router.post('/category/addCategory',protectRoute,addCategory);
admin_router.get('/category/fetch',protectRoute,fetchCategory);
admin_router.patch('/category/updateCategory',protectRoute,editCategory);
admin_router.delete('/category/deleteCategory/:deleteId',protectRoute,unlistCategory);
admin_router.patch('/category/unlistCategory/:categoryId',protectRoute,listCategory);

// subCategory
admin_router.post('/category/addSubCategory',protectRoute,addSubCategory);
admin_router.patch('/category/updateSubCategory',protectRoute,updateSubCategory);
admin_router.patch('/category/subCategoryUnlist/:subCategoryId',protectRoute,unlistSubCategory);
admin_router.patch('/category/listSubCategory/:subCategoryId',protectRoute,listSubCategory);
admin_router.get('/category/addProductListCategory',addProductCategoryListing);


// product
const {
    addProduct
 } = require('../controllers/product.controller');

 const upload = require('../middleware/multer')
 admin_router.post('/product/addProduct', upload.array('images',3), protectRoute, addProduct)

module.exports = admin_router; 