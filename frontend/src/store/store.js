import {configureStore } from "@reduxjs/toolkit";
import  userSlice  from './reducers/user/users_auth_slice'
import  adminSlice  from './reducers/admin/admin_auth_slice'
import  categoryManagement  from './reducers/admin/category'
import  AllProducts  from './reducers/admin/product_slice'


const store = configureStore({
   reducer:{
       user: userSlice,
       admin: adminSlice,
       category:categoryManagement,
       AllProducts,
   }
})

export default store;