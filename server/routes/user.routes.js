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
    resetPassword
} = require('../controllers/user/user.controller');
// auth routes
user_router.post('/register', register);
user_router.post('/login', login);
user_router.get('/logout', protectRoute, logout);

// google auth routes

user_router.post('/googleSignup', googleSignup);
user_router.post('/googleLogin', loginWIthGoogle);


// email verification

user_router.post('/email-verification', emailVerification);
user_router.post('/email-resendcode', emailResendCode);
user_router.get('/refresh', protectRoute, refreshToken)

// /forgot-password

user_router.post('/forgot-password',forgotPassowrd);
// midleware for token check 
const {verifyResetToken} = require('../middleware/verifyResetToken ')
user_router.patch('/reset-passowrd',verifyResetToken,resetPassword);
// user products 
const { getAllProducts } = require('../controllers/user/userProducts.controller');                                   
user_router.get('/product/fetchAllProducts', getAllProducts)


// wislist addProduct and delete from the wislist and remove also
const {productAddTowishlist,removeProductFromwishlist,fetchWislist} = require('../controllers/user/wislist.controller');
user_router.get('/product/fetchwishlist',protectRoute,fetchWislist);
user_router.post('/product/wislistManage/:productId',protectRoute,productAddTowishlist);
user_router.delete('/product/removeitemWislist/:productId',protectRoute,removeProductFromwishlist);
module.exports = user_router;  