import { createSlice } from "@reduxjs/toolkit";
import { adminLogin } from "../../middlewares/admin/admin_auth";


const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState : {
        admin: localStorage.getItem('admin')? JSON.parse(localStorage.getItem('admin')) : null,
        isAuthenticated: JSON.parse(localStorage.getItem('adminIsisAuthenticated')) ||false,
        loading: false
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
                state.isAuthenticated = true
                localStorage.setItem('admin', JSON.stringify(action.payload));
                localStorage.setItem('adminIsisAuthenticated', 'true');
            })
            .addCase(adminLogin.rejected, (state) => {
                state.loading = false;
                state.admin = null;
                state.isAuthenticated = false
                localStorage.removeItem('admin');
                localStorage.removeItem('adminIsisAuthenticated');
            })
    }
})

export default adminAuthSlice.reducer;
