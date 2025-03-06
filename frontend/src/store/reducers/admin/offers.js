import { createSlice } from "@reduxjs/toolkit";
import { addOffer, getAllOffers, deleteOffer } from "../../middlewares/admin/offerHandle"

const initialState = {
    loading: false,
    productOffers: [],
    subcategoryOffers: [],
}

const handlePending = (state) => {
    state.loading = true
}
const handleFulfild = (state, action) => {

    state.loading = false;
    state.productOffers = action.payload.productOffers;
    state.subcategoryOffers = action.payload.subcategoryOffers;
}
const handleReject = (state) => {
    state.loading = false
}
const offerHandling = createSlice({
    name: 'offerHandling',
    initialState,
    extraReducers: (builder) => {
        builder
            // getAll 
            .addCase(getAllOffers.pending, handlePending)
            .addCase(getAllOffers.fulfilled, handleFulfild)
            .addCase(getAllOffers.rejected, handleReject)

            // add new Offer
            .addCase(addOffer.pending, handlePending)
            .addCase(addOffer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addOffer.rejected, handleReject)

            // delete 
            .addCase(deleteOffer.pending, handlePending)
            .addCase(deleteOffer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteOffer.rejected, handleReject)


    }
})
export default offerHandling.reducer 