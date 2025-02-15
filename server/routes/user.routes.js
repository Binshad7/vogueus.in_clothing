const express = require('express');
const user_router = express.Router();
const protectRoute = require('../middleware/protectRoute')

const {
    register,
    login,
    logout,
    googleSignup,
    loginWIthGoogle,
    refreshToken,
    emailVerification,
    emailResendCode,
    forgotPassowrd,
    resetPassword,
    updateUserName,
    checkPassowrd,
    changePassword
} = require('../controllers/user/user.controller');
// auth routes
user_router.post('/register', register);
user_router.post('/login', login);
user_router.post('/logout', protectRoute, logout);
// google auth routes
user_router.post('/googleSignup', googleSignup);
user_router.post('/googleLogin', loginWIthGoogle);
// email verification
user_router.post('/email-verification', emailVerification);
user_router.post('/email-resendcode', emailResendCode);
user_router.get('/refresh', protectRoute, refreshToken)
// update userProfiles userName and passowrds
user_router.patch('/user/upddateProfile/:userId', protectRoute, updateUserName)
//forgot-password
user_router.post('/forgot-password', forgotPassowrd);
// changePassowrd 
user_router.post('/user/checkPassowrd/:userId', protectRoute, checkPassowrd)
user_router.patch('/user/changePassword/:userId', protectRoute, changePassword)

// midleware for token check 
const { verifyResetToken } = require('../middleware/verifyResetToken ')
user_router.patch('/reset-passowrd', verifyResetToken, resetPassword);
// user products 
const { getAllProducts } = require('../controllers/user/userProducts.controller');
user_router.get('/product/fetchAllProducts', getAllProducts)


// wislist addProduct and delete from the wislist and remove also
const { productAddTowishlist, removeProductFromwishlist, fetchWislist } = require('../controllers/user/wislist.controller');
user_router.get('/product/fetchwishlist', protectRoute, fetchWislist);
user_router.post('/product/wislistManage/:productId', protectRoute, productAddTowishlist);
user_router.delete('/product/removeitemWislist/:productId', protectRoute, removeProductFromwishlist);


// cart management 
const { addToCart, deleteItemFromCart, listCart, quantityChangeHandle } = require('../controllers/user/cart.controller')
user_router.post('/product/addToCart', protectRoute, addToCart);
user_router.delete('/product/removeItemCart/:productId', protectRoute, deleteItemFromCart)
user_router.get('/product/getCartItems', protectRoute, listCart)
user_router.patch('/product/cartitemQuantityHandle/:cartId', protectRoute, quantityChangeHandle)


// Addresses
const { addewAddress, deleteAddress, editAddress } = require('../controllers/user/addAddress.controller');
user_router.post('/addNewAddress/:userId', protectRoute, addewAddress);
user_router.delete('/deleteAddress/:addressId', protectRoute, deleteAddress)
user_router.patch('/editAddress/:addressId', protectRoute, editAddress)


// order
const { createNewOrder, getUserOrderes, cancellOrder, cancelOrderItem, returnOrderItem, returnOrder,razorpayPaymentStatus,paymentCaneled } = require('../controllers/user/order.controller')
user_router.post('/neworder/:userId', protectRoute, createNewOrder)
user_router.patch('/orders/orderPaymentStatus/:orderId', protectRoute, razorpayPaymentStatus);
user_router.patch('/orders/orderPaymentFaild/:orderId', protectRoute, paymentCaneled);
user_router.get('/orders/:userId', protectRoute, getUserOrderes)
// cancelOrder
user_router.patch('/orders/cancellOrder/:orderId', protectRoute, cancellOrder);
user_router.patch('/orders/cancellItem/:orderId/:itemId', protectRoute, cancelOrderItem);
user_router.patch('/orders/returnOrderItem/:orderId', protectRoute, returnOrderItem);
user_router.patch('/orders/returnOrder/:orderId', protectRoute, returnOrder);

// wallete user 
const { userWalletDetail } = require('../controllers/user/wallete.controller')
user_router.get('/wallete/:userId', protectRoute, userWalletDetail);

module.exports = user_router;  