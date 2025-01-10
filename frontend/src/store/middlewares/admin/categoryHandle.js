import { createAsyncThunk } from "@reduxjs/toolkit";
import adminAxios from "../../../api/adminAxios";
import { toast } from "react-toastify";


// fetch all category 
const fetchCategory = createAsyncThunk(
    'category/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminAxios.get('/category/fetch');
            return JSON.parse(response.data.categorys);
        } catch (error) {

            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

// create new Parent category
const createCategory = createAsyncThunk(
    'category/create',
    async (categoryName, { rejectWithValue }) => {
        try {
            const response = await adminAxios.post('/category/addCategory', { categoryName: categoryName })
            toast.success(response.data.message || 'category created');
            return JSON.parse(response.data.categorys);
        } catch (error) {

            toast.error(error.response.data.message)
            return rejectWithValue(error.response?.data || error.message)
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
            return JSON.parse(response.data.categorys);
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
            const response = await adminAxios.delete(`/category/deleteCategory/${categoryID}`);
            toast.success('category delete success fully completed');
            return JSON.parse(response.data.categorys);
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
            const response = await adminAxios.patch(`/category/unlistCategory/${categoryID}`);
            toast.success('category unlist success fully completed');
            return JSON.parse(response.data.categorys);
        } catch (error) {

            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

// add sub category 

const addSubCategory = createAsyncThunk(
    'category/addSubCategory',
    async (subCategory, { rejectWithValue }) => {
        try {
            console.log(subCategory);
            const response = await adminAxios.post('/category/addSubCategory', subCategory);
            toast.success('success fully created subcategory ')
            return JSON.parse(response.data.categorys)
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

// update SubCategory

const updateSubCategory = createAsyncThunk(
    'category/updateSubCategory',
    async (updateData, { rejectWithValue }) => {
        try {
            console.log(updateData);
            const response = await adminAxios.patch('/category/updateSubCategory', updateData);
            toast.success('success fully update subcategory Name ')
            return JSON.parse(response.data.categorys)
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
// subCategory unlist 

const subCategoryUnlist = createAsyncThunk(
    'category/subCategoryUnlist',
    async (SubCategoryID, { rejectWithValue }) => {
        try {
            console.log(SubCategoryID);
            const response = await adminAxios.patch(`/category/subCategoryUnlist/${SubCategoryID}`);
            toast.success('success fully unlist subCategory ')
            return JSON.parse(response.data.categorys)
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

// list catgoery 

const listSubCategory = createAsyncThunk(
    'category/listSubCategory',
    async (SubCategoryID, { rejectWithValue }) => {
        try {
            console.log(SubCategoryID);
            const response = await adminAxios.patch(`/category/listSubCategory/${SubCategoryID}`);
            toast.success('success fully list subCategory ')
            return JSON.parse(response.data.categorys)
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
    unlistParentCategory,
    addSubCategory,
    updateSubCategory,
    subCategoryUnlist,
    listSubCategory
}