import { createSlice } from "@reduxjs/toolkit";
import { createNewOreder, getOrderItems, cancelOrder, returnOrderItem, returnOrder } from '../../middlewares/user/orders'
const initialState = {
    loading: false,
    orderes: []
}
const handlePending = (state) => {
    state.loading = true
}
const handleSuccess = (state, action) => {
    state.loading = false
    state.orderes = action.payload
}
const handleRejected = (state) => {
    state.loading = false
}

const userOrders = createSlice({
    name: "userOrders",
    initialState,
    extraReducers: (builder) => {
        builder
            // get All orders for the user
            .addCase(getOrderItems.pending, handlePending)
            .addCase(getOrderItems.fulfilled, handleSuccess)
            .addCase(getOrderItems.rejected, handleRejected)

            // add a new order 

            .addCase(createNewOreder.pending, handlePending)
            .addCase(createNewOreder.fulfilled, (state, action) => {
                state.orderes.push(action.payload);
                state.loading = false
            })
            .addCase(createNewOreder.rejected, handleRejected)
            // cancelorder
            .addCase(cancelOrder.pending, handlePending)
            .addCase(cancelOrder.fulfilled, handleSuccess)
            .addCase(cancelOrder.rejected, handleRejected)
            // handle the Returrn Product 
            .addCase(returnOrderItem.pending, handlePending)
            .addCase(returnOrderItem.fulfilled, handleSuccess)
            .addCase(returnOrderItem.rejected, handleRejected)
            // return order
            .addCase(returnOrder.pending, handlePending)
            .addCase(returnOrder.fulfilled, handleSuccess)
            .addCase(returnOrder.rejected, handleRejected)
    }
})
export default userOrders.reducer