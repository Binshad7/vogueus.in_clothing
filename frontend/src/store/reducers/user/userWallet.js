import { createSlice } from "@reduxjs/toolkit";
import { getWallete } from '../../middlewares/user/wallete'
const initialState = {
    userWallete: [],
    loading: false
}
const handlePending = (state) => {
    state.loading = true
}
const handleFulfilled = (state, action) => {
    state.userWallete = action.payload
    state.loading = false
}
const handleReject = (state) => {
    state.loading = false
}

const userWalletDetails = createSlice({
    name: "userWallete",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getWallete.pending, handlePending)
            .addCase(getWallete.fulfilled, handleFulfilled)
            .addCase(getWallete.rejected, handleReject)
    }
})


export default userWalletDetails.reducer