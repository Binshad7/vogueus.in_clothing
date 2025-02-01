import { createSlice } from "@reduxjs/toolkit";
import { createNewOreder } from '../../middlewares/user/orders'
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
            .addCase(createNewOreder.pending, handlePending)
            .addCase(createNewOreder.fulfilled, handleSuccess)
            .addCase(createNewOreder.rejected, handleRejected)
    }
})

export default userOrders.reducer