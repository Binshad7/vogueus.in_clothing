import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders } from '../../middlewares/admin/admin_order_handle'
const initialState = {
    loading: false,
    orders: [],
    totalPages: 1,
    totalOrders: 0,
    currentPage: 1
};


const handlePending = (state) => {
    state.loading = true;
}
const handleFulfilled = (state, action) => {
    state.loading = false;
    state.orders = action.payload.orders;
    state.totalPages = action.payload.totalPages;
    state.totalOrders = action.payload.totalOrders;
    state.currentPage = action.payload.currentPage;
};
const handleReject = (state) => {
    state.loading = false;
}


const adminOrders = createSlice({
    name: 'adminOrders',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllOrders.pending, handlePending)
            .addCase(getAllOrders.fulfilled, handleFulfilled)
            .addCase(getAllOrders.rejected, handleReject)
    }
})

export default adminOrders.reducer