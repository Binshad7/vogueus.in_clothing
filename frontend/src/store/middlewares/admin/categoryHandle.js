import { createAsyncThunk } from "@reduxjs/toolkit";
import adminAxios from "../../../api/adminAxios";
import { toast } from "react-toastify";


// create new Parent category
const createCategory = createAsyncThunk(
    'category/create',
    async (categoryName, { rejectWithValue }) => {
        try {

            const response = await adminAxios.post('/category/addCategory', { categoryName: categoryName })
            toast.success(response.data.message || 'category created')
            return response.data.categorys

        } catch (error) {

            toast.error(error.response.data.message)
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// fetch all category 
const fetchCategory = createAsyncThunk(
    'category/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAxios.get('/category/fetch');
            return response.data.categorys;
        } catch (error) {

            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
// update Parent Category
const updateCategory = createAsyncThunk(
    'category/updateCategory',
    async (updatetingValues, { rejectWithValue }) => {
        try {
            console.log(updatetingValues)
            const response = await adminAxios.patch('/category/updateCategory', updatetingValues);
            toast.success('category update success fully completed');
            return response.data.categorys;
        } catch (error) {

            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
// soft delete parent category
const deleteCategory = createAsyncThunk(
    'category/deleteCategory',
    async (categoryID, { rejectWithValue }) => {
        try {
            console.log(categoryID)
            const response = await adminAxios.delete(`/category/deleteCategory/${categoryID}`);
            toast.success('category delete success fully completed');
            return response.data.categorys;
        } catch (error) {

            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

// unlist category

const unlistParentCategory = createAsyncThunk(
    'category/unlistCategory',
    async (categoryID, { rejectWithValue }) => {
        try {
            console.log(categoryID)
            const response = await adminAxios.patch(`/category/unlistCategory/${categoryID}`);
            toast.success('category unlist success fully completed');
            return response.data.categorys;
        } catch (error) {

            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)




export {
    createCategory,
    fetchCategory,
    updateCategory,
    deleteCategory,
    unlistParentCategory
}