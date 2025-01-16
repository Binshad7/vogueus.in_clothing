import { createSlice } from "@reduxjs/toolkit";
import {
    fetchAllProducts
} from "../../middlewares/user/products_handle";

const initialState = {
    AllProducts: [],
    loading: false,
};

// Helper function to handle pending state
const handlePending = (state) => {
    state.loading = true;
};

// Helper function to handle auth success
const handleFulfiled = (state, action) => {
    state.loading = false;
    state.AllProducts = action.payload;
};

// Helper function to handle rejection
const handleRejection = (state) => {
    state.loading = false;
};

const AllProductManageSlice = createSlice({
    name: 'AllProductManageSlice',
    initialState,
    extraReducers: (builder) => {
     builder
     .addCase(fetchAllProducts.pending,handlePending)
     .addCase(fetchAllProducts.fulfilled,handleFulfiled)
     .addCase(fetchAllProducts.rejected,handleRejection)
    }
})

export default AllProductManageSlice.reducer