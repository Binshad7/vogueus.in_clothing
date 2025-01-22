import { configureStore } from "@reduxjs/toolkit";
import userSlice from './reducers/user/users_auth_slice'
import adminSlice from './reducers/admin/admin_auth_slice'
import categoryManagement from './reducers/admin/category'
import AllProducts from './reducers/admin/product_slice'
import AllUsersHandle from './reducers/admin/usersAdminHandle'
import AllProductManageSlice from './reducers/user/products_handle_slice'
import wishlist from './reducers/user/wishlist'

const store = configureStore({
    reducer: {
        user: userSlice,
        admin: adminSlice,
        category: categoryManagement,
        AllProducts,
        AllUsersHandle,
        AllProductManageSlice,
        wishlist
    }
})

export default store;