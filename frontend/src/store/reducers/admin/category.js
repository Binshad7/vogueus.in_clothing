import { createSlice } from "@reduxjs/toolkit";
import {
    createCategory,
    fetchCategory,
    updateCategory,
    deleteCategory,
    unlistParentCategory,
    addSubCategory,
    updateSubCategory,
    subCategoryUnlist,
    listSubCategory,
    addProductListCategory
} from '../../middlewares/admin/categoryHandle'



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
    // state.category = []
    // localStorage.removeItem('categorys');

}
const categoryManagement = createSlice({
    name: 'categoryMangemente',
    initialState: {
        loading: false,
        category: [],
        addProductListingCategory: []
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
            // add subcategory 
            .addCase(addSubCategory.pending, handlePending)
            .addCase(addSubCategory.fulfilled, handleFulfilled)
            .addCase(addSubCategory.rejected, (state) => {
                state.loading = false;
            })
            // update sub category
            .addCase(updateSubCategory.pending, handlePending)
            .addCase(updateSubCategory.fulfilled, handleFulfilled)
            .addCase(updateSubCategory.rejected, (state) => {
                state.loading = false;
            })
            // subCategory unlist the subCategory
            .addCase(subCategoryUnlist.pending, handlePending)
            .addCase(subCategoryUnlist.fulfilled, handleFulfilled)
            .addCase(subCategoryUnlist.rejected, (state) => {
                state.loading = false;
            })
            // subCategory list the subCategory
            .addCase(listSubCategory.pending, handlePending)
            .addCase(listSubCategory.fulfilled, handleFulfilled)
            .addCase(listSubCategory.rejected, (state) => {
                state.loading = false;
            })
            // addProductListCategory
            .addCase(addProductListCategory.pending, handlePending)
            .addCase(addProductListCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.addProductListingCategory = action.payload;
            })
            .addCase(addProductListCategory.rejected, (state) => {
                state.loading = false;
            })


    }
})
export default categoryManagement.reducer