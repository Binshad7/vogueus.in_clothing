import { createSlice } from "@reduxjs/toolkit";
import { adminLogin,  adminRefresh } from "../../middlewares/admin/admin_auth";

const handlePending = (state) => {
    state.loading = true
}
const handleFulfilled = (state,action) => {
    state.loading = false;
    state.admin = action.payload;
    state.isAuthenticated = true
    localStorage.setItem('admin', JSON.stringify(action.payload));
    localStorage.setItem('adminIsisAuthenticated', 'true');
}
const handleReject = (state) => {
    state.loading = false;
    state.admin = null;
    state.isAuthenticated = false
    localStorage.removeItem('admin');
    localStorage.removeItem('adminIsisAuthenticated');
}
const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState: {
        admin: JSON.parse(localStorage.getItem('admin')) || null,
        isAuthenticated: JSON.parse(localStorage.getItem('adminIsisAuthenticated')) || false,
        loading: false
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, handlePending)
            .addCase(adminLogin.fulfilled, handleFulfilled)
            .addCase(adminLogin.rejected, handleReject)

            .addCase(adminRefresh.pending, handlePending)
            .addCase(adminRefresh.fulfilled, handleFulfilled)
            .addCase(adminRefresh.rejected, handleReject)
    }
})

export default adminAuthSlice.reducer;
