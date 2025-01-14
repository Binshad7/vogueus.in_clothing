import { createSlice } from "@reduxjs/toolkit";
import {
    AddProduct,
} from '../../middlewares/admin/ProductRelate'

const initialState = {
    loading: false,
    Products: []
}
const handlePending = (state) => {
    state.loading = true
}
const handleFulfilled = (state,action) => {
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

     .addCase(AddProduct.pending,handlePending)
     .addCase(AddProduct.fulfilled,handleFulfilled)
     .addCase(AddProduct.rejected,handleReject)
     
    }
})

export default  AllProducts.reducer

