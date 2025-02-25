import { createSlice } from "@reduxjs/toolkit";
import { addOffer } from "../../middlewares/admin/offerHandle"

const initialState = {
    loading: false,
    offers: []
}

const handlePending = (state) => {
    state.loading = true
}
const handleFulfild = (state, action) => {

    state.loading = false;
    state.offers = action.payload;
}
const handleReject = (state) => {
    state.loading = false
}
// const handleUpdateActions = (state, action) => {
//     let index = state.coupons.findIndex(item => item._id == action.payload._id);
//     state.coupons[index] = action.payload
// }
const offerHandling = createSlice({
    name: 'offerHandling',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addOffer.pending, handlePending)
            .addCase(addOffer.fulfilled, handleFulfild)
            .addCase(addOffer.rejected, handleReject)

    }
})
export default offerHandling.reducer 