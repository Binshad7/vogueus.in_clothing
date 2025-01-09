import { createSlice } from "@reduxjs/toolkit";
import { createCategory, fetchCategory,updateCategory,deleteCategory,unlistParentCategory } from '../../middlewares/admin/categoryHandle'



const handlePending = (state) => {
    state.loading = true
}
const handleFulfilled = (state, action) => {
    state.loading = false;
    state.category = action.payload;
    localStorage.setItem('categorys', JSON.stringify(action.payload))
}
const handleReject = (state) => {
    state.loading = false;
    state.category = []
    localStorage.removeItem('categorys');

}
const categoryManagement = createSlice({
    name: 'categoryMangemente',
    initialState: {
        loading: false,
        category: []
    },
    extraReducers: (builder) => {
        builder
            //  create category
            .addCase(createCategory.pending, handlePending)
            .addCase(createCategory.fulfilled, handleFulfilled)
            .addCase(createCategory.rejected, handleReject)
            // fetch category
            .addCase(fetchCategory.pending, handlePending)
            .addCase(fetchCategory.fulfilled, handleFulfilled)
            .addCase(fetchCategory.rejected, handleReject)
            // update category
            .addCase(updateCategory.pending, handlePending)
            .addCase(updateCategory.fulfilled, handleFulfilled)
            .addCase(updateCategory.rejected, handleReject)
            // delete category
            .addCase(deleteCategory.pending, handlePending)
            .addCase(deleteCategory.fulfilled, handleFulfilled)
            .addCase(deleteCategory.rejected, handleReject)
             // unlist category
            .addCase(unlistParentCategory.pending, handlePending)
            .addCase(unlistParentCategory.fulfilled, handleFulfilled)
            .addCase(unlistParentCategory.rejected, handleReject)


    }
})
export default categoryManagement.reducer