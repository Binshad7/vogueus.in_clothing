const express = require('express');
const admin_router = express.Router();
const protectRoute = require('../middleware/protectRoute');




const {
    adminLogin,
    adminLogout,
    adminRefresh,

} = require('../controllers/admin/admin.controller');
// auth routes
admin_router.post('/login', adminLogin);
admin_router.post('/logout', protectRoute, adminLogout);
admin_router.get('/refresh', protectRoute, adminRefresh);


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
} = require('../controllers/admin/category.controller');

admin_router.post('/category/addCategory', protectRoute, addCategory);
admin_router.get('/category/fetch', protectRoute, fetchCategory);
admin_router.patch('/category/updateCategory', protectRoute, editCategory);
admin_router.delete('/category/deleteCategory/:deleteId', protectRoute, unlistCategory);
admin_router.patch('/category/unlistCategory/:categoryId', protectRoute, listCategory);

// subCategory
admin_router.post('/category/addSubCategory', protectRoute, addSubCategory);
admin_router.patch('/category/updateSubCategory', protectRoute, updateSubCategory);
admin_router.patch('/category/subCategoryUnlist/:subCategoryId', protectRoute, unlistSubCategory);
admin_router.patch('/category/listSubCategory/:subCategoryId', protectRoute, listSubCategory);
admin_router.get('/category/addProductListCategory', addProductCategoryListing);


// product
const {
    addProduct,
    fetchProduct,
    updateProductStatus,
    updateProduct
} = require('../controllers/admin/product.controller');

const upload = require('../middleware/multer')
admin_router.post('/product/addProduct', upload.array('images', 3), protectRoute, addProduct);
admin_router.get('/product/fetchProduct', protectRoute, fetchProduct)
admin_router.patch('/product/updateProductStatus/:proId', protectRoute, updateProductStatus)
admin_router.patch('/product/updateProduct/:proId', upload.array('images', 3), protectRoute, updateProduct)



// admin users handle 
const { fetchAllUsers, updateUserStatus } = require('../controllers/admin/adminManageUser.controller')
admin_router.get('/usersHandle/fetchUsers', protectRoute, fetchAllUsers)
admin_router.patch('/usersHandle/blockAndUnBlock/:userID', protectRoute, updateUserStatus)

// handle All Orders
const {getAllordersToAdmin,updateOrderItemStatus} = require('../controllers/admin/ordersHandle.controller')
admin_router.get('/orders/getallorders',protectRoute,getAllordersToAdmin);
admin_router.patch('/orders/updateOrderStatus/:orderId/:itemId',protectRoute,updateOrderItemStatus);

module.exports = admin_router; 