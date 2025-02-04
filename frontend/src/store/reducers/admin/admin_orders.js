import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders } from '../../middlewares/admin/admin_order_handle'
const initialState = {
    loading: false,
    orders: []
}

const handlePending = (state) => {
    state.loading = true;
}
const handleFulfilled = (state, action) => {
    state.loading = false;
    state.orders = action.payload;
}
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