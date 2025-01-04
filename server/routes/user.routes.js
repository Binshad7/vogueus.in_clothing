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
    emailResendCode
} = require('../controllers/user.controller');
// auth routes
user_router.post('/register', register);
user_router.post('/login', login);
user_router.get('/logout', logout);

// google auth routes

user_router.post('/googleSignup', googleSignup);
user_router.post('/googleLogin', loginWIthGoogle);


// email verification

user_router.post('/email-verification', emailVerification);
user_router.post('/email-resendcode', emailResendCode);


user_router.get('/refresh',protectRoute,refreshToken )


module.exports = user_router;