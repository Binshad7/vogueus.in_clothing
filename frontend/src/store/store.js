import {configureStore } from "@reduxjs/toolkit";
import  userSlice  from './reducers/user/users_auth_slice'
import  adminSlice  from './reducers/admin/admin_auth_slice'
import  categoryManagement  from './reducers/admin/category'


const store = configureStore({
   reducer:{
       user: userSlice,
       admin: adminSlice,
       category:categoryManagement
   }
})

export default store;