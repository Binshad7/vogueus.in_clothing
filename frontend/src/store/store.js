import {configureStore } from "@reduxjs/toolkit";
import  userSlice  from './reducers/user/users_auth_slice'
import  adminSlice  from './reducers/admin/admin_auth_slice'


const store = configureStore({
   reducer:{
       user: userSlice,
       admin: adminSlice
   }
})

export default store;