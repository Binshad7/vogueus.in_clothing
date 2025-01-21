import { createSlice } from "@reduxjs/toolkit";
import {
    addProdcut,
    fetchProduct,
    blockAndUnBlock,
    updateProduct
} from '../../middlewares/admin/ProductRelate'

const initialState = {
    loading: false,
    Products: []
}
const handlePending = (state) => {
    state.loading = true
}
const handleFulfilled = (state, action) => {
    state.loading = false;
    state.Products = action.payload
}
const handleReject = (state) => {
    state.loading = false
}


const AllProducts = createSlice({
    name: 'AllProductManage',
    initialState,
    extraReducers: (builder) => {
        builder

            // fetch all Product
            .addCase(fetchProduct.pending, handlePending)
            .addCase(fetchProduct.fulfilled, handleFulfilled)
            .addCase(fetchProduct.rejected, handleReject)

            // add new Product 
            .addCase(addProdcut.pending, handlePending)
            .addCase(addProdcut.fulfilled, handleFulfilled)
            .addCase(addProdcut.rejected, handleReject)
            // add new Product 
            .addCase(blockAndUnBlock.pending, handlePending)
            .addCase(blockAndUnBlock.fulfilled, handleFulfilled)
            .addCase(blockAndUnBlock.rejected, handleReject)
            // updateProduct
            .addCase(updateProduct.pending, handlePending)
            .addCase(updateProduct.fulfilled, handleFulfilled)
            .addCase(updateProduct.rejected, handleReject)

    }
})

export default AllProducts.reducer

