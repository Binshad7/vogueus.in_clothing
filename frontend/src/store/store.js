import { configureStore } from "@reduxjs/toolkit";
import userSlice from './reducers/user/users_auth_slice'
import AllUsersHandle from './reducers/admin/usersAdminHandle'
import wishlist from './reducers/user/wishlist'
import Cart from './reducers/user/cart'
import userOrders from './reducers/user/userOrders'
import userWalleteDetails from './reducers/user/userWallet'
// admin
import AllProductManageSlice from './reducers/user/products_handle_slice'
import categoryManagement from './reducers/admin/category'
import adminSlice from './reducers/admin/admin_auth_slice'
import AllProducts from './reducers/admin/product_slice'
import adminOrders from './reducers/admin/admin_orders'
import couponHandling from './reducers/admin/coupon'
const store = configureStore({
    reducer: {
        user: userSlice,
        admin: adminSlice,
        category: categoryManagement,
        AllProducts,
        AllUsersHandle,
        AllProductManageSlice,
        wishlist,
        Cart,
        userOrders,
        adminOrders,
        userWalleteDetails,
        couponHandling
    }
})

export default store;