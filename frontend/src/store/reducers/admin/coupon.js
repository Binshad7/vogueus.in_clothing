import { createSlice } from "@reduxjs/toolkit";
import { addCoupon, editCoupon, getAllCoupons, updateBlockStatus, deleteCoupon } from "../../middlewares/admin/coupon"

const initialState = {
    loading: false,
    coupons: []
}

const handlePending = (state) => {
    state.loading = true
}
const handleFulfild = (state, action) => {

    state.loading = false;
    state.coupons = action.payload;
}
const handleReject = (state) => {
    state.loading = false
}
const handleUpdateActions = (state, action) => {
    let index = state.coupons.findIndex(item => item._id == action.payload._id);
    state.coupons[index] = action.payload
}
const couponHandling = createSlice({
    name: 'couponHandling',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllCoupons.pending, handlePending)
            .addCase(getAllCoupons.fulfilled, handleFulfild)
            .addCase(getAllCoupons.rejected, handleReject)

            .addCase(addCoupon.pending, handlePending)
            .addCase(addCoupon.fulfilled, (state, action) => {
                state.coupons.push(action.payload);
                state.loading = false
            })
            .addCase(addCoupon.rejected, handleReject)

            // update status
            .addCase(updateBlockStatus.pending, handlePending)
            .addCase(updateBlockStatus.fulfilled, handleUpdateActions)
            .addCase(updateBlockStatus.rejected, handleReject)
            // editAction
            .addCase(editCoupon.pending, handlePending)
            .addCase(editCoupon.fulfilled, handleUpdateActions)
            .addCase(editCoupon.rejected, handleReject)

            // deleteItem

            .addCase(deleteCoupon.pending, handlePending)
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                let filterCoupons = state.coupons.filter(item => item._id.toString() !== action.payload);
                state.coupons = filterCoupons;
                state.loading = false
            })
            .addCase(deleteCoupon.rejected, handleReject)
    }
})
export default couponHandling.reducer 