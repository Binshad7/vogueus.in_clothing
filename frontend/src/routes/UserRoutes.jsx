import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserProtectedRoute from './UserProtectedRoute'
import Login from '../pages/user/Login/Login'
import Register from '../pages/user/Register/Register'
import Home from '../pages/user/Home/Home'
import Navigation from '../components/user/Navigation'
import OTPVerification from '../pages/user/OTP/OTPVerification'
import ProductDetails from '../pages/user/ProductDetailPage/ProductDetails'
import Footer from '../components/user/Footer'
import NotFoundPage from '../components/NotFoundPage'
import ForgotPassword from '../pages/user/forgotPassword/ForgotPassword'
import PasswordResetConfirmation from '../pages/user/forgotPassword/PasswordResetConfirmation'
import NewPassword from '../pages/user/forgotPassword/NewPassword'
import PasswordSuccess from '../pages/user/forgotPassword/PasswordSuccess'
import WishlistPage from '../pages/user/wislist/WishlistPage'
import CartPage from '../pages/user/Cart/CartPage'
import AccountLayout from '../pages/user/Account/AccountLayout'
import AddAddress from '../pages/user/Account/AddAddress'
import Orders from '../pages/user/Account/Orders'
import Settings from '../pages/user/Account/Settings'
import Profile from '../pages/user/Account/Profile'
import CheckoutPage from '../pages/user/payment/CheckoutPage'
import OrderSuccessPage from '../components/user/OrderSuccessPage'
import WalletPage from '../pages/user/Account/WalletPage'
import Shop from '../pages/user/shop/Shop'
import Coupons from '../pages/user/Account/Coupons'
function UserRoutes() {

    return (
        <>
            <Navigation />
            <Routes>
                <Route path='*' element={<NotFoundPage />} />
                <Route path='/' element={<Home />} />
                <Route path='/shop' element={<Shop />} />
               
               


                {/* product Detail page */}
                <Route path='/product/:productId' element={<ProductDetails />} />

                {/* User Profile pages */}
                <Route path='/account-details' element={<AccountLayout />}>
                    <Route index element={<UserProtectedRoute element={<Profile />} />} />
                    <Route path="profile" element={<UserProtectedRoute element={<Profile />} />} />
                    <Route path="wallet" element={<UserProtectedRoute element={<WalletPage />} />} />
                    <Route path="orders" element={<UserProtectedRoute element={<Orders />} />} />
                    <Route path="address" element={<UserProtectedRoute element={<AddAddress />} />} />
                    <Route path="coupons" element={<UserProtectedRoute element={<Coupons />} />} />
                    <Route path="settings" element={<UserProtectedRoute element={<Settings />} />} />
                </Route>

                <Route path='/wishlist' element={<UserProtectedRoute element={<WishlistPage />} />} />
                <Route path='/cart-items' element={<UserProtectedRoute element={<CartPage />} />} />
                <Route path='/checkout' element={<UserProtectedRoute element={<CheckoutPage />} />} />
                <Route path='/orderSuccess/:orderId' element={<UserProtectedRoute element={<OrderSuccessPage />} />} />

              

                {/* register and login  */}

                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/verify-email' element={<OTPVerification />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/PasswordResetConfirmation' element={<PasswordResetConfirmation />} />
                <Route path='/reset-password' element={<NewPassword />} />
                <Route path='/passwordChangeSuccess' element={<PasswordSuccess />} />


            </Routes>
            <Footer />
        </>
    )
}

export default UserRoutes
