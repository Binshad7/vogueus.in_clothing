import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserProtectedRoute from './UserProtectedRoute'
import Login from '../pages/user/Login/Login'
import Register from '../pages/user/Register/Register'
import Home from '../pages/user/Home/Home'
import Navigation from '../components/user/Navigation'
import Account from '../pages/user/Account/Account'
import OTPVerification from '../pages/user/OTP/OTPVerification'
import ProductDetails from '../pages/user/ProductDetailPage/ProductDetails'
import Footer from '../components/user/Footer'
import NotFoundPage from '../components/NotFoundPage'
import ForgotPassword from '../pages/user/forgotPassword/ForgotPassword'
import PasswordResetConfirmation from '../pages/user/forgotPassword/PasswordResetConfirmation'
import NewPassword from '../pages/user/forgotPassword/NewPassword'
import PasswordSuccess from '../pages/user/forgotPassword/PasswordSuccess'
import WishlistPage from '../pages/user/wislist/WishlistPage'
function UserRoutes() {

    return (
        <>
            <Navigation />
            <Routes>
                <Route path='*' element={<NotFoundPage />} />
                <Route path='/' element={<Home />} />
                {/* <Route path='/shop' element={<Shop />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                */}
                <Route path='/product/:productId' element={<ProductDetails />} />

                {/* Protected Route */}
                <Route path='/account-details/profile' element={<UserProtectedRoute element={<Account />} />} />
                {/* <Route path='/orders' element={   <UserProtectedRoute element={<Orders />}/>} />
                <Route path='/order/:orderId' element={ <UserProtectedRoute element={<Order />}/>} />
                <Route path='/address' element={<UserProtectedRoute element={<Address />}/>} />
                <Route path='/wallet' element={<UserProtectedRoute element={<Wallet/>} />} />
                <Route path='/Coupons' element={<UserProtectedRoute element={<Coupons />}/>} />
                <Route path='/settings' element={<Settings />} /> */}
                {/*  */}


                <Route path='/wishlist' element={<UserProtectedRoute element={<WishlistPage />} />} />
                {/* 
                <Route path='/cart-items' element={<Cart />} />
                <Route path='/support' element={<Support />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/orderConfirmed' element={<OrderConfirmed />} /> */}
                {/* register and login  */}

                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/verify-email' element={<OTPVerification />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/PasswordResetConfirmation' element={<PasswordResetConfirmation />} />
                <Route path='/reset-password' element={<NewPassword />} />
                <Route path='/passwordChangeSuccess' element={<PasswordSuccess />} />
                {/*
                <Route path='/reset-password' element={<ResetPassword />} /> */}

                {/* <Route path='*' element={<NotFound />} /> */}
            </Routes>
            <Footer />
        </>
    )
}

export default UserRoutes
